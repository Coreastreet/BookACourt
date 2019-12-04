class AdminController < ApplicationController

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
    console
    respond_to do |format|
      format.js
      # format.html
    end
  end

  private

  def sports_centre_peak_params
      params.permit(:id, :peak_hours)
  end
end
