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
    @sports_centre = SportsCentre.find(params[:id])
    array_booking = []
    bookings = @sports_centre.bookings
    bookings.each do |booking|
      array_booking << booking.to_json
    end
    session[:bookings] = bookings.to_json
    # console
    #respond_to do |format|
    #  format.js
      # format.html
    # end
  end

  def addNewBookings
    newBookings = newBookingParams
    #binding.pry
    newBookings.values.each do |bookingOrder|
      if (bookingOrder["booking"]["bookingType"] == "casual")
          newOrder = Order.create!(bookingOrder["order"])
          newBooking = Booking.new(bookingOrder["booking"])
          newBooking.update!(order_id: newOrder.id)
          newBooking.save!
      else # regular booking made
          newOrder = Order.create!(bookingOrder["order"])
          bookingOrder["booking"]["date"].each do |date|
            newBooking = Booking.new(bookingOrder["booking"])
            newBooking.update!(order_id: newOrder.id, date: date)
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
