class Api::V1::BookingsController < Api::V1::ApiController

  def create
    require "rest-client"
    require "json"

    sports_centre = SportsCentre.find(token_params[:sports_centre_id])

    url = "https://poliapi.apac.paywithpoli.com/api/v2/Transaction/GetTransaction?token=" + token_params[:Token]
    response = RestClient.get url, {Authorization: sports_centre.combinedCode}
    parsed_response = JSON.parse(response)
    # if the transaction is successful,
    # create the booking
    if (parsed_response["TransactionStatus"] == "Completed")

      payerFirstName = parsed_response["PayerFirstName"]
      payerLastName = parsed_response["PayerFamilyName"]
      transactionRefNo = parsed_response["TransactionRefNo"]

      data = JSON.parse(parsed_response["MerchantData"])
      #binding.pry
      combinedDates = data["order"]["firstDayBookings"] + data["order"]["allDates"]

      new_order = Order.create!(fullName: "#{payerFirstName} #{payerLastName}", transactionRefNo: transactionRefNo.to_i,
      email_address: data["order"]["customerEmail"], totalCost: data["order"]["totalAmount"],
      daysInBetween: data["order"]["daysInBetween"], startDate: combinedDates.first,
      endDate: combinedDates.last, merchantRef: parsed_response["MerchantReference"])
      orderId = new_order.id
      bookingType = data["booking"]["bookingType"]
      id = token_params[:sports_centre_id]
      # add the transaction fee to the sportcentres total amount due.
      moneyOwed = sports_centre.moneyOwed + data["order"]["totalCommission"].to_d
      sports_centre.update!(moneyOwed: moneyOwed)
      # merchantReference = parsed_response["MerchantReference"] same as the sent info
      # if successful, the customer will be given a reference 6-digit code to identify the order.
      customerReference = "#{orderId}-#{transactionRefNo[0..-3]}" # should remain unique since the first half is always unique
      new_order.update!(customerRef: customerReference)
      # use the same random pin for each booking
      booking_pin = pin_generate
      data["booking"]["courtIdTimesArray"].each do |booking|
        idTimesArray = booking.split("-")
        Booking.create!(startTime: idTimesArray[1], endTime: idTimesArray[2],
          courtType: data["booking"]["courtType"], sports_centre_id: id,
          order_id: orderId, date: data["order"]["firstDayBookings"][0], bookingType: bookingType,
          court_no: idTimesArray[0], pin: booking_pin,
          name: "#{payerFirstName} #{payerLastName}", sportsType: data["booking"]["activityType"] ) # later calculate the courtNumber
      end

      start = data["booking"]["startTime"]
      endTime = data["booking"]["endTime"]
      regularIds = data["order"]["arrayOfRegularCourtIds"]

      if (!(data["order"]["allDates"].empty?)) # if the extra regular dates are not empty?
        data["order"]["allDates"].each_with_index do |date, index|
            Booking.create!(startTime: start, endTime: endTime,
              courtType: data["booking"]["courtType"], sports_centre_id: id,
              order_id: orderId, date: date, bookingType: bookingType,
              court_no: regularIds[index], pin: booking_pin)
        end
      end
      #merchantAccountName = parsed_response["MerchantAccountName"]
      #financialInstitutionName = parsed_response["FinancialInstitutionName"]
      #merchantName = parsed_response["MerchantName"]
      #bankReceiptDateTime = parsed_response["BankReceiptDateTime"]
      # binding.pry
      # send message to admin dashboard of the corresponding centre
      #to notify in real time that a new booking has been made and update the dashboard.
      DashboardChannel.broadcast_to(sports_centre, new_order.bookings)
      #ActionCable.server.broadcast "update_widget_#{sports_centre.id}", {
      #  message: "new booking",
      #}
      Rails.logger.info("update sent")

      NotificationsMailer.with(sports_centre: sports_centre,
      order: new_order).booking_invoice.deliver_later
    end

  end

  def check_availability
    sportsCentre = SportsCentre.find(params[:sports_centre_id])
    interval_in_days = interval_params[:dayInterval]
    date = interval_params[:date]
    @json_bookings = sportsCentre.bookings.to_json
    @numberOfCourts = sportsCentre.numberOfCourts
    @prices = sportsCentre.prices
    @peak_hours = sportsCentre.peak_hours
    @opening_hours = sportsCentre.opening_hours.to_json
    if @json_bookings
      render :json => {json_bookings: @json_bookings, number_of_courts: @numberOfCourts, opening_hours: @opening_hours,
      prices: @prices, peak_hours: @peak_hours, success: true, content_type: 'application/json'}.to_json, status: 200
    else
      render :json => {:error => "not-found", success: false, content_type: 'application/json'}.to_json, :status => 404
    end
  end

  def reserve
    require "rest-client"
    require "json"

    sportsCentre = SportsCentre.find(params[:sports_centre_id])
    sportsCentre_url = sportsCentre.URL

    amount = order_params[:totalAmount].to_f
    # get the amount, merchant id and customer email in the params
    # look up the authorisation code for the related merchant.
    # get the relevant url for transaction and send back.
    # create a new string for later conversion into booking and order conversion
    # store the string in merchantData
    # calculate the start and end Date later
    # if guest transaction, leave user_id as nil
    isBWrequest = !order_params[:bwFirstDayBookings].nil?
    # account for possibility that request is sent by third party widget
    if (order_params[:allDates].nil?)
        allDates = (isBWrequest) ? JSON.parse(order_params[:bwAllDates]) : []
    else
        allDates = order_params[:allDates]
    end
    if (order_params[:allDates].nil?)
        arrayOfRegularCourtIds = (isBWrequest) ? JSON.parse(order_params[:bwArrayOfRegularCourtIds]) : []
    else
        arrayOfRegularCourtIds = order_params[:arrayOfRegularCourtIds]
    end
    # arrayOfRegularCourtIds = (order_params[:allDates].nil?) ? [] :

    courtIdTimesArray = (booking_params[:courtIdTimesArray].nil?) ? JSON.parse(booking_params[:bwCourtIdTimesArray]) : booking_params[:courtIdTimesArray]
    #binding.pry
    merchantDataString = '{"order":' +
      "{\"allDates\": #{allDates.compact}," +
      "\"totalAmount\": \"#{order_params[:totalAmount]}\"," +
      "\"plan\": \"#{sportsCentre.plan}\"," +
      "\"totalCommission\": \"#{order_params[:totalAmount].to_i * sportsCentre.transactionRate}\"," +
      "\"daysInBetween\": \"#{order_params[:daysInBetween]}\"," +
      "\"firstDayBookings\": #{order_params[:bwFirstDayBookings]}," +
      "\"arrayOfRegularCourtIds\": #{arrayOfRegularCourtIds}," +
      "\"customerEmail\": \"#{order_params[:customerEmail]}\"}" +
      ",\"booking\":" +
      "{\"courtIdTimesArray\": #{courtIdTimesArray}," +
      "\"startTime\": \"#{booking_params[:startTime]}\"," +
      "\"endTime\": \"#{booking_params[:endTime]}\"," +
      "\"bookingType\": \"#{booking_params[:bookingType]}\"," +
      "\"activityType\": \"#{booking_params[:activityType].capitalize}\"," +
      "\"courtType\": \"#{booking_params[:courtType]}\"}}"

    data = JSON.parse(merchantDataString)

    bookingType = data["booking"]["bookingType"]
    id = params[:sports_centre_id]
    bookingArray = []

    data["booking"]["courtIdTimesArray"].each do |booking|
      idTimesArray = booking.split("-")
      booking1 = Booking.new(startTime: idTimesArray[1], endTime: idTimesArray[2],
        courtType: data["booking"]["courtType"], sports_centre_id: params[:sports_centre_id],
        date: data["order"]["firstDayBookings"][0], bookingType: bookingType,
        court_no: idTimesArray[0], sportsType: data["booking"]["activityType"] ) # later calculate the courtNumber
      bookingArray << booking1
    end


    start = data["booking"]["startTime"]
    endTime = data["booking"]["endTime"]
    regularIds = data["order"]["arrayOfRegularCourtIds"]

    if (!(data["order"]["allDates"].empty?)) # if the extra regular dates are not empty?
      data["order"]["allDates"].each_with_index do |date, index|
          regBooking = Booking.new(startTime: start, endTime: endTime,
            courtType: data["booking"]["courtType"], sports_centre_id: params[:sports_centre_id],
            date: date, bookingType: bookingType,
            court_no: regularIds[index], sportsType: data["booking"]["activityType"])
          bookingArray << regBooking
      end
    end

    RestClient.post "https://weball.com.au/pub/#{id}",  {event: "live_reservation_update", bookings: bookingArray.to_json.html_safe}.to_json, {content_type: :json, accept: :json}
    if bookingArray.any?
      render :json => {success: true, content_type: 'application/json'}.to_json, :status => 200
    else
      render :json => {:error => "not-found", success: false, content_type: 'application/json'}.to_json, :status => 404
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
    isBWrequest = !order_params[:bwFirstDayBookings].nil?
    # account for possibility that request is sent by third party widget
    if (order_params[:allDates].nil?)
        allDates = (isBWrequest) ? JSON.parse(order_params[:bwAllDates]) : []
    else
        allDates = order_params[:allDates]
    end
    if (order_params[:allDates].nil?)
        arrayOfRegularCourtIds = (isBWrequest) ? JSON.parse(order_params[:bwArrayOfRegularCourtIds]) : []
    else
        arrayOfRegularCourtIds = order_params[:arrayOfRegularCourtIds]
    end
    # arrayOfRegularCourtIds = (order_params[:allDates].nil?) ? [] :

    courtIdTimesArray = (booking_params[:courtIdTimesArray].nil?) ? JSON.parse(booking_params[:bwCourtIdTimesArray]) : booking_params[:courtIdTimesArray]
    #binding.pry

    merchantDataString = '{"order":' +
      "{\"allDates\": #{allDates}," +
      "\"totalAmount\": \"#{order_params[:totalAmount]}\"," +
      "\"plan\": \"#{sportsCentre.plan}\"," +
      "\"totalCommission\": \"#{order_params[:totalAmount].to_i * sportsCentre.transactionRate}\"," +
      "\"daysInBetween\": \"#{order_params[:daysInBetween]}\"," +
      "\"firstDayBookings\": #{order_params[:bwFirstDayBookings]}," +
      "\"arrayOfRegularCourtIds\": #{arrayOfRegularCourtIds}," +
      "\"customerEmail\": \"#{order_params[:customerEmail]}\"}" +
      ",\"booking\":" +
      "{\"courtIdTimesArray\": #{courtIdTimesArray}," +
      "\"startTime\": \"#{booking_params[:startTime]}\"," +
      "\"endTime\": \"#{booking_params[:endTime]}\"," +
      "\"bookingType\": \"#{booking_params[:bookingType]}\"," +
      "\"activityType\": \"#{booking_params[:activityType].capitalize}\"," +
      "\"courtType\": \"#{booking_params[:courtType]}\"}}"
      #{}"{\"startTime\": \"#{booking_params[:startTime]}\"," +
      #{}"\"endTime\": \"#{booking_params[:endTime]}\"," +
    #binding.pry
    # calculate the total amount again on the server side to ensure the total amount is not tampered with on client-side form
    # use the sports centre object to reference opening hours, peak hours and prices.
    # array of booked days; the start and endtime; the specific court ids used each week is irrelevant.
    totalAmountServer = calculateTotalPriceServer(sportsCentre, JSON.parse(order_params[:bwFirstDayBookings]), allDates,
    booking_params[:startTime], booking_params[:endTime], booking_params[:activityType], booking_params[:courtType])

    response = RestClient.post "https://poliapi.apac.paywithpoli.com/api/v2/Transaction/Initiate",
          {Amount: amount, CurrencyCode: "AUD", MerchantReference: orderReference,
            MerchantHomepageURL: sportsCentre_url, #sportsCentre_url,
            MerchantData: merchantDataString,
            SuccessURL: "https://weball.com.au/sports_centres/#{params[:sports_centre_id]}/booking_success",
            FailureURL: sportsCentre_url, # redirect to page with failure message later on
            CancellationURL: sportsCentre_url,
            NotificationURL: "https://weball.com.au/api/v1/sports_centres/#{params[:sports_centre_id]}/bookings"},
            {Authorization: "#{sportsCentre.combinedCode}"}

    parsedResponse = JSON.parse(response.body)
    if (response.code == 200 && parsedResponse["Success"])
      if (isBWrequest)
        render :json => {success: true, content_type: 'application/json', redirect_url: parsedResponse["NavigateURL"]}.to_json, :status => 200
      else
        redirect_to parsedResponse["NavigateURL"]
      end
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

  # qr-code not needed
  def check_qrCode
    #binding.pry
    sportsCentre = SportsCentre.find(params[:sports_centre_id])
    matchingBookings = sportsCentre.bookings.where(pin: pin_params[:pin])
    details = ""
    error = ""
    date = ""
    result = false
    if (matchingBookings.any?) # exists
      matchingBooking = matchingBookings.find_by(date: Date.today)
      if (matchingBooking)      # matching booking for todays date specifically
          if (matchingBooking.claimed == false) # booking not claims yet
            if (Time.now.strftime("%H:%M") < matchingBooking.endTime.strftime("%H:%M"))
              result = true # Booking Valid!
              matchingBooking.update!(claimed: true)
              name = matchingBooking.name
              startTime = matchingBooking.startTime.strftime("%l:%M%p").gsub(/\s+/, "")
              endTime = matchingBooking.endTime.strftime("%l:%M%p").gsub(/\s+/, "")
              details = {topMessage: "Hi #{name}", bottomMessage: "#{startTime}-#{endTime}", success_code: 0}
            else # time for booking has elapsed
              error = "Booking period over"
              details = {error: error, error_code: 0}
            end
          else # claimed is true i.e. the customer scanned in for entry already
            result = true
            name = matchingBooking.name
            details = {topMessage: "Bye #{name}", bottomMessage: "See you next time!", success_code: 1}
          end
      else
        error = "No Booking Today"
        details = {error: error, error_code: 2}
      end
    else
        error = "No Bookings made!"
        details = {error: error, error_code: 3}
    end
    render :json => {result: result, details: details}.to_json, status: 200
    #sportsCentre.
  end

private

  def calculateTotalPriceServer(sports_centre, firstDate, allOtherDates, startTime, endTime, activityType, courtType)
    Rails.logger.info "#{firstDate}, #{firstDate.class}"
    Rails.logger.info "#{allOtherDates}, #{allOtherDates.class}"
    Rails.logger.info "#{startTime}, #{startTime.class}"
    Rails.logger.info "#{endTime}, #{endTime.class}"
    allDates = firstDate + allOtherDates
    startTimeHolder = Time.parse(startTime)
    endTimeHolder = Time.parse(endTime)
    bookingTimesArray = []
    while (startTimeHolder != endTimeHolder) do
        bookingTimesArray.push(startTimeHolder.strftime("%H:%M"))
        startTimeHolder += 30.minutes
    end

    totalCost = 0
    peak_hours = sports_centre.peak_hours
    prices = sports_centre.prices
    allDates.each do |bookingDate|
      dateHolder = Date.parse(bookingDate)
      bookingDay = dateHolder.strftime("%a").to_sym
      dayPeakHours = peak_hours[bookingDay]
      dayPeakStart = Time.parse(dayPeakHours[:startingPeakHour]).strftime("%H:%M")
      dayPeakEnd = Time.parse(dayPeakHours[:closingPeakHour]).strftime("%H:%M")

      bookingTimesArray.each do |bookingTime|
          Rails.logger.info "#{dayPeakStart}, #{dayPeakEnd}"
          if (bookingTime.between?(dayPeakStart, dayPeakEnd) && (bookingTime != dayPeakEnd)) # must be charged at peak rate
              peakType = "peak_hour"
              Rails.logger.info "#{bookingTime}, peak_hour, #{bookingDay}"
          else
              peakType = "off_peak"
              Rails.logger.info "#{bookingTime}, off_peak, #{bookingDay}"
          end
          totalCost += ((prices[activityType]["casual"]["#{courtType[0..3]}_court"][peakType].to_d)/2)
          # divide by two so it accounts for each half-hour
      end

      Rails.logger.info "#{totalCost}, #{totalCost.class}"
    end
  end

  def pin_generate
    require "securerandom"
    (SecureRandom.random_number(9e5) + 1e5).to_i
  end

  def barcode_number_params
    params.permit(:barcode_number)
  end

  def pin_params
    params.permit(:pin)
  end

  def token_params
    params.permit(:Token, :sports_centre_id)
  end

  def interval_params
    params.permit(:dayInterval, :sports_centre_id, :date)
  end

  def order_params
    params.require(:order).permit(:totalAmount, :customerEmail, :daysInBetween, :bwAllDates, :bwArrayOfRegularCourtIds, :bwFirstDayBookings, allDates: [], arrayOfRegularCourtIds: [], firstDayBookings: [])
  end

  def booking_params
    params.require(:booking).permit(:courtType, :bookingType, :activityType, :startTime, :endTime, :bwCourtIdTimesArray, courtIdTimesArray: [])
  end

end
