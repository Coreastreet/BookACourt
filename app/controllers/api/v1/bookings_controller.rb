class Api::V1::BookingsController < Api::V1::ApiController

  def create
    require "rest-client"
    require "json"

    url = "https://poliapi.apac.paywithpoli.com/api/v2/Transaction/GetTransaction?token=" + token_params[:Token]
    response = RestClient.get url, {Authorization: ENV["POLIPAY_AUTH"]}
    parsed_response = JSON.parse(response)

    # if the transaction is successful,
    # create the booking
    if (parsed_response["TransactionStatus"] == "Completed")
      payerFirstName = parsed_response["PayerFirstName"]
      payerLastName = parsed_response["PayerFamilyName"]
      transactionRefNo = parsed_response["TransactionRefNo"]

      data = JSON.parse(parsed_response["MerchantData"])
      new_order = Order.create!(fullName: "#{payerFirstName} #{payerLastName}", transactionRefNo: transactionRefNo.to_i,
      email_address: data["order"]["customerEmail"], totalCost: data["order"]["totalAmount"],
      daysInBetween: data["order"]["daysInBetween"], startDate: data["order"]["allDates"].first,
      endDate: data["order"]["allDates"].last, merchantRef: parsed_response["MerchantReference"])
      orderId = new_order.id
      # merchantReference = parsed_response["MerchantReference"] same as the sent info
      # if successful, the customer will be given a reference 6-digit code to identify the order.
      customerReference = "#{orderId}-#{transactionRefNo[0..-3]}" # should remain unique since the first half is always unique
      new_order.update!(customerRef: customerReference)
      data["order"]["allDates"].each do |date|
        Booking.create!(startTime: data["booking"]["startTime"], endTime: data["booking"]["endTime"],
          courtType: data["booking"]["courtType"], sports_centre_id: token_params[:sports_centre_id],
          order_id: orderId, date: date, bookingType: data["booking"]["bookingType"],
          courtType: data["booking"]["courtType"]) # later calculate the courtNumber
      end

      #merchantAccountName = parsed_response["MerchantAccountName"]
      #financialInstitutionName = parsed_response["FinancialInstitutionName"]
      #merchantName = parsed_response["MerchantName"]
      #bankReceiptDateTime = parsed_response["BankReceiptDateTime"]
      # binding.pry
      sports_centre = SportsCentre.find(token_params[:sports_centre_id])
      NotificationsMailer.with(sports_centre: sports_centre,
      order: new_order).booking_invoice.deliver_later
    end

  end

  def initiate
    # to check the params
    require "rest-client"
    require "json"

    sportsCentre = SportsCentre.find(params[:sports_centre_id])
    sportsCentre_url = sportsCentre.URL

    attemptedBookings = sportsCentre.attemptedBookings
    orderReference = "#{params[:sports_centre_id]}_Order_#{attemptedBookings}" # dummy reference; not useful
    attemptedBookings += 1;
    sportsCentre.update!(attemptedBookings: attemptedBookings)
    amount = order_params[:totalAmount].to_f
    # get the amount, merchant id and customer email in the params
    # look up the authorisation code for the related merchant.
    # get the relevant url for transaction and send back.
    # create a new string for later conversion into booking and order conversion
    # store the string in merchantData
    # calculate the start and end Date later
    # if guest transaction, leave user_id as nil
    merchantDataString = '{"order":' +
      "{\"allDates\": #{order_params[:allDates]}," +
      "\"totalAmount\": \"#{order_params[:totalAmount]}\"," +
      "\"daysInBetween\": \"#{order_params[:daysInBetween]}\"," +
      "\"customerEmail\": \"#{order_params[:customerEmail]}\"}" +
      ",\"booking\":" +
      "{\"startTime\": \"#{booking_params[:startTime]}\"," +
      "\"endTime\": \"#{booking_params[:endTime]}\"," +
      "\"bookingType\": \"#{booking_params[:bookingType]}\"," +
      "\"courtType\": \"#{booking_params[:courtType]}\"}}"

    binding.pry
    response = RestClient.post "https://poliapi.apac.paywithpoli.com/api/v2/Transaction/Initiate",
          {Amount: amount, CurrencyCode: "AUD", MerchantReference: orderReference,
            MerchantHomepageURL: sportsCentre_url,
            MerchantData: merchantDataString,
            SuccessURL: "http://www.localhost:3000/sports_centres/#{params[:sports_centre_id]}/booking_success",
            FailureURL: "http://www.localhost:3000/sports_centres/failure", # redirect to page with failure message later on
            CancellationURL: "http://www.localhost:3000/sports_centres/cancelled",
            NotificationURL: "https://02801ab0.ngrok.io/api/v1/sports_centres/#{params[:sports_centre_id]}/bookings"},
            {Authorization: "Basic UzYxMDQ2ODk6RWQ2QCRNYjM0Z14="}

    parsedResponse = JSON.parse(response.body)
    if (response.code == 200 && parsedResponse["Success"])
      redirect_to parsedResponse["NavigateURL"]
    else
      logger.info "initiate transaction action has failed"
    end
  end

  def claim_booking
    barcode_number = barcode_number_params[:barcode_number].chop.to_i
    order = Order.find_by(transactionRefNo: barcode_number)
    if order.nil?
      msg = {:error => "Booking Not Found"}
    else
      todays_date = Date.today
      booking_for_today = order.bookings.detect { |booking| booking.date == todays_date }   # array
      if booking_for_today.nil?
        msg = {:error => "Order found but booking not made for today"}
      else
        time_now = Time.now
        time_reference = Time.utc(2000,1,1,time_now.hour, time_now.min, time_now.sec)
        if time_reference.between?((booking_for_today.startTime - 1.hour), booking_for_today.endTime)
          booking_for_today.update!(claimed: true)
          msg = {:message => "Booking Confirmed!",
            :startTime => booking_for_today.startTime.strftime("%I:%M%p"),
            :endDate =>  booking_for_today.endTime.strftime("%I:%M%p"),
            :name => booking_for_today.order.fullName}
        else
          msg = {:error => "Bookings found for today but customer either too early or too late",
            :startTime => booking_for_today.startTime.strftime("%I:%M%p"), :endDate =>  booking_for_today.endTime.strftime("%I:%M%p")}
        end
      end
    end
    #respond_to do |format|
    render :json => msg
    #end
  end

private

  def barcode_number_params
    params.permit(:barcode_number)
  end

  def token_params
    params.permit(:Token, :sports_centre_id)
  end

  def order_params
    params.require(:order).permit(:totalAmount, :customerEmail, :daysInBetween, allDates: [])
  end

  def booking_params
    params.require(:booking).permit(:courtType, :startTime, :endTime, :bookingType)
  end

end
