class AdminController < ApplicationController
  before_action :check_logged_in
  before_action :admin_pin_access, only: [:update_logo, :update_prices, :update_hours]

  def newPeakHour
    @weekdays = Date::DAYNAMES
    respond_to do |format|
      format.js
      # format.html
    end
  end

  def updatePeakHours
    require 'json'
    @sportsCentre = SportsCentre.find(sports_centre_peak_params[:id])
    peak_hours = JSON.parse(sports_centre_peak_params[:peak_hours])

    peak_hours.transform_values!{ |h| h.transform_keys!{ |key| key.to_sym} }
    peak_hours.transform_keys! { |key| key.to_sym }

    @sportsCentre.update!(peak_hours: peak_hours)
    respond_to do |format|
      format.js
      # format.html
    end
  end

  def editPeakHours
  end

  def show_again
    @sports_centre = SportsCentre.find(params[:id])
    array_booking = []
    bookings = @sports_centre.bookings
    bookings.each do |booking|
      array_booking << booking.to_json
    end
    session[:bookings] = bookings.to_json
    #binding.pry
    respond_to do |format|
      format.js
      # format.html
    end
  end

  def show
    require "date"
    require "restclient"
    @sports_centre = SportsCentre.find(params[:id])
    @centreType = @sports_centre.centreType_before_type_cast
    @arrayCourtNames = @sports_centre.arrayCourtNames
    array_booking = []
    bookings = @sports_centre.bookings
    @new_booking = Booking.new
    bookings.each do |booking|
      array_booking << booking.to_json
    end
    session[:bookings] = bookings.to_json
    # make a restclient get call to the api for daily transactions
    todayDate = (Date.today - 1.day).strftime("%Y-%m-%d")
    jsonDailyTransactions =  "[{\"MerchantData\":\"one\"}]"  # RestClient.get("https://poliapi.apac.paywithpoli.com/api/v2/Transaction/GetDailyTransactions?date=#{todayDate}&statuscodes=Completed",{Authorization: @sports_centre.combinedCode})
    @arrayDailyTransactions = (JSON.parse(jsonDailyTransactions)).reverse()
    @arrayDailyTransactions.reject! { |hash| !hash["MerchantData"].include?("[") }

    @arrayDailyTransactions.each do |transaction|
      transaction["MerchantData"] = JSON.parse(transaction["MerchantData"])
    end
    [:setPrices, :edit_profile, :setLogo, :upgrade_plan].each do |buttonRef|
        session[buttonRef] = false
    end
  end

  def getPastRecords
    require "restclient"
    date = Date.parse(date_params[:date])
    formattedDate = date.strftime("%Y-%m-%d")
    jsonDailyTransactions = RestClient.get("https://poliapi.apac.paywithpoli.com/api/v2/Transaction/GetDailyTransactions?date=#{formattedDate}&statuscodes=Completed",{Authorization: current_sports_centre.combinedCode})
    @arrayDailyTransactions = (JSON.parse(jsonDailyTransactions)).reverse()
    @arrayDailyTransactions.each do |transaction|
      data = transaction["MerchantData"]
      if (data.starts_with?('{') && data.ends_with?('}'))
          transaction["MerchantData"] = JSON.parse(data)
      end
    end
    respond_to do |format|
      format.js
      # format.html
    end
  end

  def check_pin
    pin = pin_params[:pin].to_i
    matchedBooking = current_sports_centre.bookings.find_by(pin: pin, date: Date.today)
    if !matchedBooking.nil? # customer has booking today, return with name and green alert
      @matchingBooking_id = matchedBooking.id
      @booking_found = true
    else # alert red no booking today
      @booking_found = false
    end
    respond_to do |format|
      format.js
      # format.html
    end
  end

  def check_admin_pin
    @buttonId = admin_pin_params[:buttonId]
    pin = admin_pin_params[:adminPin]
    rep = current_sports_centre.representative
    if (rep && rep.authenticate(pin))
      @isAdmin = true
      buttonRef = @buttonId[1..].to_sym
      session[buttonRef] = true
    else
      @isAdmin = false
    end
    respond_to do |format|
      format.js
    end
  end

  def payment_success
    require 'json'
    require 'restclient'
    url = "https://poliapi.apac.paywithpoli.com/api/v2/Transaction/GetTransaction?token=" + token_params[:token]
    response = RestClient.get url, {Authorization: "Basic UzYxMDQ2ODk6RWQ2QCRNYjM0Z14="}
    parsed_response = JSON.parse(response)

    # if the transaction is successful,
    # create the booking
    transactionRefNo = parsed_response["TransactionRefNo"]
    amountPaid = parsed_response["AmountPaid"].to_d

    @sportsCentre = current_sports_centre;
    @poliMessage = "Your payment transaction has been successful!"
    @sendInvoice = true
    @imageRef = "email-sent-icon.png"
    respond_to do |format|
      format.html { render :payment }
    end

  end

  def payment_failure
    url = "https://poliapi.apac.paywithpoli.com/api/v2/Transaction/GetTransaction?token=" + token_params[:token]
    response = RestClient.get url, {Authorization: "Basic UzYxMDQ2ODk6RWQ2QCRNYjM0Z14="}
    parsed_response = JSON.parse(response)

    @sportsCentre = current_sports_centre;

    if (parsed_response["TransactionStatus"] == "ReceiptUnverified")
      @poliMessage = "Communications were lost at a crucial time." +
      " As a result, you should check with your bank to check" +
      " if they have processed the payment transaction successfully."
      @imageRef = "paymentReceiptUnverified.png"
      respond_to do |format|
        format.html { render :payment }
      end
    else
      @poliMessage = "Sorry, your payment transaction has failed."
      @imageRef = "paymentFailed.png"
      respond_to do |format|
        format.html { render :payment }
      end
    end
  end

  def payment_cancelled
    @sportsCentre = current_sports_centre;
    @poliMessage = "Your payment transaction has been cancelled."
    @imageRef = "paymentCancelled.png"
    respond_to do |format|
      format.html { render :payment }
    end
  end

  def payment_receipt_unverified
  end

  def lockPage
     buttonRef = lock_params[:buttonRef][1..].to_sym
     session[buttonRef] = false
  end

  def pay_money_owed
    require "restclient"
    yesterdayMoneyOwed = current_sports_centre.yesterdayMoneyOwed.to_s
    currentDate = Date.current
    orderReference = "#{params[:id]}_payment_#{currentDate.strftime("%d-%m-%y")}"

    info = "#{current_sports_centre.title}: #{yesterdayMoneyOwed}AUD"
    response = RestClient.post "https://poliapi.apac.paywithpoli.com/api/v2/Transaction/Initiate",
          {Amount: yesterdayMoneyOwed, CurrencyCode: "AUD", MerchantReference: orderReference,
            MerchantHomepageURL: "https://weball.com.au", #sportsCentre_url,
            MerchantData: info,
            SuccessURL: "https://weball.com.au/admin/sports_centre/#{params[:id]}/payment_success",
            FailureURL: "https://weball.com.au/admin/sports_centre/#{params[:id]}/payment_failure", # redirect to page with failure message later on
            CancellationURL: "https://weball.com.au/admin/sports_centre/#{params[:id]}/payment_cancelled",
            NotificationURL: "https://weball.com.au/api/v1/sports_centres/#{params[:id]}/payment_nudge"},
            {Authorization: "Basic UzYxMDQ2ODk6RWQ2QCRNYjM0Z14="}

    parsedResponse = JSON.parse(response.body)

    if (response.code == 200 && parsedResponse["Success"])
        redirect_to parsedResponse["NavigateURL"]
    else
      logger.info "initiate transaction action has failed"
    end

  end

  def addNewBookings
    newBookings = newBookingParams
    #binding.pry
    newBookings.values.each do |bookingOrder|
      if (bookingOrder["booking"]["bookingType"] == "casual")
          newOrder = Order.create!(bookingOrder["order"])
          newBooking = Booking.new(bookingOrder["booking"])
          newBooking.update!(order_id: newOrder.id, pin: pin_generate)
          newBooking.save!
      else # regular booking made
          newOrder = Order.create!(bookingOrder["order"])
          constant_pin = pin_generate
          bookingOrder["booking"]["date"].each do |date|
            newBooking = Booking.new(bookingOrder["booking"])
            newBooking.update!(order_id: newOrder.id, date: date, pin: constant_pin)
            newBooking.save!
          end
      end
    end
  end

  def deleteBooking
    #binding.pry
    booking = Booking.find(deleteBookingParams[:booking_id])
    booking.destroy!
  end

  def deleteOrder
    order = Order.find(deleteOrderParams[:order_id])
    order.destroy!
  end

  def update_plan
    buttonRef = lock_params[:buttonRef][1..].to_sym
    if session[buttonRef]
          planType = plan_params[:plan]
          if (planType == "Premium")
            transactionRate = 0.04
          elsif (planType == "Standard")
            transactionRate = 0.0165
          else #if (planType == "Premium")
            transactionRate = 0.0
          end
          current_sports_centre.update!(plan: plan_params[:plan], transactionRate: transactionRate)
    end
  end

  def update_hours
    # update the sportsCentre with logo and new details
    buttonRef = lock_params[:buttonRef][1..].to_sym
    if session[buttonRef]
        require 'json'
        openHours = JSON.parse(hour_params[:opening_hours])
        peakHours = JSON.parse(hour_params[:peak_hours])

        openHours.transform_values!{ |h| h.transform_keys!{ |key| key.to_sym} }
        openHours.transform_keys! { |key| key.to_sym }

        peakHours.transform_values!{ |h| h.transform_keys!{ |key| key.to_sym} }
        peakHours.transform_keys! { |key| key.to_sym }

        sports_centre = SportsCentre.find(id_params[:id])


        sports_centre.update!(opening_hours: openHours)

        sports_centre.update!(peak_hours: peakHours)
    end
  end

  def update_logo
    buttonRef = lock_params[:buttonRef][1..].to_sym
    if session[buttonRef]
          id = id_params[:id]
          sports_centre = SportsCentre.find(id)
          sports_centre.update!(sports_centre_params)
          sports_centre.logo.blob.open do |image|
            File.open("#{Rails.root}/public/system/sports_centre_logo_#{id}", "wb") do |f|
                f.write(image.read)
            end
          end
          splitCourtNames = arrayCourtNames_params[:arrayCourtNames].split(",")
          sports_centre.update!(arrayCourtNames: splitCourtNames)
    end
  end

  def update_prices
    puts params.inspect
    buttonRef = lock_params[:buttonRef][1..].to_sym
    if session[buttonRef]
        require 'json'
        sports_centre = SportsCentre.find(id_params[:id])
        jsonPrices = JSON.parse(sports_centre_params[:prices])
        sports_centre.update!(prices: jsonPrices)

        # allowed update of courtsAllowed
        jsonCourtsAllowed = JSON.parse(sports_centre_params[:courtsAllowed])
        sports_centre.update!(courtsAllowed: jsonCourtsAllowed)

        #allow update of the centre type to remove court Tabs in widget
        sports_centre.update!(centreType: sports_centre_params[:centreType])
    end
  end

  private

  def arrayCourtNames_params
      params.require("sports_centre").permit(:arrayCourtNames)
  end

  def admin_pin_params
      params.permit(:adminPin, :buttonId, :id)
  end

  def pin_params
      params.require(:sports_centre).require(:booking).permit(:pin)
  end

  def newBookingParams
      params.require(:arrOrderAndBookings).permit!
  end

  def deleteOrderParams
      params.permit(:order_id)
  end

  def deleteBookingParams
      params.permit(:booking_id)
  end

  def sports_centre_peak_params
      params.permit(:id, :peak_hours)
  end

  def hour_params
      params.require(:sports_centre).permit(:opening_hours, :peak_hours)
  end

  def plan_params
      params.require(:sports_centre).permit(:plan)
  end

  def date_params
      params.permit(:id, :date) #.require(:)
  end

  def sports_centre_params
      params.require(:sports_centre).permit(:title, :email, :password, :password_confirmation, :ABN,
         :phone, :description, :logo, :merchantCode, :authenticationCode, :numberOfCourts, :prices,
          :courtsAllowed, :centreType)
  end

  def token_params
    params.permit(:token, :id)
  end

  def id_params
      params.permit(:id)
  end

  def check_logged_in
      redirect_to login_path if !logged_in_as_sports_centre?# since not logged in
  end

  def lock_params
      params.permit(:buttonRef)
  end

  def admin_pin_access

  end
end
