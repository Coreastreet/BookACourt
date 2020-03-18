class AdminController < ApplicationController

  before_action :check_logged_in

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
    array_booking = []
    bookings = @sports_centre.bookings
    @new_booking = Booking.new
    bookings.each do |booking|
      array_booking << booking.to_json
    end
    session[:bookings] = bookings.to_json
    # make a restclient get call to the api for daily transactions
    todayDate = (Date.today - 1.day).strftime("%Y-%m-%d")
    jsonDailyTransactions = RestClient.get("https://poliapi.apac.paywithpoli.com/api/v2/Transaction/GetDailyTransactions?date=#{todayDate}&statuscodes=Completed",{Authorization: @sports_centre.combinedCode})
    @arrayDailyTransactions = (JSON.parse(jsonDailyTransactions)).reverse()
    @arrayDailyTransactions.each do |transaction|
      transaction["MerchantData"] = JSON.parse(transaction["MerchantData"])
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

  def pay_moneyOwed
    moneyOwed = current_sports_centre.moneyOwed
    moneyPaid = current_sports_centre.moneyPaid
    info = current_sports_centre.title
    response = RestClient.post "https://poliapi.apac.paywithpoli.com/api/v2/Transaction/Initiate",
          {Amount: moneyOwed, CurrencyCode: "AUD", MerchantReference: orderReference,
            MerchantHomepageURL: "https://weball.com.au/api/v1/sports_centres", #sportsCentre_url,
            MerchantData: info,
            SuccessURL: "https://weball.com.au/sports_centres/#{params[:sports_centre_id]}/booking_success",
            FailureURL: "https://weball.com.au/sports_centres/failure", # redirect to page with failure message later on
            CancellationURL: "https://weball.com.au/sports_centres/cancelled",
            NotificationURL: "https://weball.com.au/api/v1/sports_centres/#{params[:sports_centre_id]}/bookings"},
            {Authorization: "Basic UzYxMDQ2ODk6RWQ2QCRNYjM0Z14="}

    parsedResponse = JSON.parse(response.body)

    if (parsed_response["TransactionStatus"] == "Completed")
      current_sports_centre.update!(moneyOwed: 0.0, moneyPaid: moneyPaid + moneyOwed)
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

  def update_hours
    # update the sportsCentre with logo and new details
    require 'json'
    openHours = JSON.parse(hour_params[:opening_hours])
    sports_centre = SportsCentre.find(id_params[:id])
    sports_centre.update!(opening_hours: openHours)

    peakHours = JSON.parse(hour_params[:peak_hours])
    sports_centre.update!(peak_hours: peakHours)
  end

  def update_logo
    sports_centre = SportsCentre.find(id_params[:id])
    sports_centre.update!(sports_centre_params)
  end

  def update_prices
    require 'json'
    sports_centre = SportsCentre.find(id_params[:id])
    jsonPrices = JSON.parse(sports_centre_params[:prices])
    sports_centre.update!(prices: jsonPrices)
  end

  private

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

  def sports_centre_params
      params.require(:sports_centre).permit(:title, :email, :password, :password_confirmation, :ABN,
         :phone, :description, :logo, :merchantCode, :authenticationCode, :numberOfCourts, :prices)
  end

  def id_params
      params.permit(:id)
  end

  def check_logged_in
      redirect_to login_path if !logged_in_as_sports_centre?# since not logged in
  end
end
