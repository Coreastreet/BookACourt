class SportsCentresController < ApplicationController
  def new
    @sports_centre = SportsCentre.new
    @new_address = Address.new
  end

  def create
    require 'json'
    new_address = Address.create(address_params[:address])
    new_sports_centre = SportsCentre.create(sports_centre_params)

    new_sports_centre.email.downcase!

    new_sports_centre.update(address: new_address)
    new_sports_centre.images.attach(sports_centre_params[:images])
    # convert the string of opening hours to json before assignment
    jsonAddress = JSON.parse(opening_hour_params[:opening_hours])
    new_sports_centre.update(opening_hours: jsonAddress)

    # format the full_address from street_address, suburb, state and postcode
    if new_address.full_address.blank?
      full_address = "#{new_address.street_address}, #{new_address.suburb} #{new_address.state} #{new_address.postcode}"
      new_address.full_address = full_address;
    end
    # new_sports_centre.images.attach(params[:sports_centre][:images])
    if new_sports_centre.save! && new_address.save!
      redirect_to sports_centre_path(new_sports_centre)# show for sports_centre
    else
      render :new
    end
  end

  def delete
  end

  def index
    console
    @sports_centres = SportsCentre.all
  end

  def show
    console
    @sports_centre = SportsCentre.find(params[:id])
    array_booking = []
    bookings = @sports_centre.bookings
    bookings.each do |booking|
      array_booking << booking.to_json
    end
    session[:bookings] = bookings.to_json
  end

  # same code as above but will load js.erb file instead of html
  def show_again
    console
    respond_to do |format|
      format.js
      # format.html
    end
  end

  def edit
  end

  private
    def sports_centre_params
        params.require(:sports_centre).permit(:title, :email, :password, :password_confirmation, :phone, :description, images:[])
    end

    def address_params
        params.require(:sports_centre).permit(address: [:full_address, :street_address, :suburb, :state, :postcode])
    end

    def opening_hour_params
        params.require(:sports_centre).permit(:opening_hours)
    end
end
