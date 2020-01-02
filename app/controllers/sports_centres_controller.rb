class SportsCentresController < ApplicationController
  def new
    @sports_centre = SportsCentre.new
    @new_address = Address.new
    @representative = Representative.new
    @new_representative_address = Address.new
    @new_contact = Contact.new
    #debugger
  end

  def create
    require 'json'
    new_address = Address.create(address_params[:address])
    new_sports_centre = SportsCentre.create(sports_centre_params)

    #puts(token_params)
    #new_sports_centre.email.downcase!

    new_sports_centre.update(address: new_address)
    new_sports_centre.update(email: "blah4@gmail.com")
    new_sports_centre.update(password: "Soba3724")
    # move opening hours and images to dashboard

    #new_sports_centre.images.attach(params[:sports_centre][:images])
    # convert the string of opening hours to json before assignment
    #jsonAddress = JSON.parse(opening_hour_params[:opening_hours])
    # new_sports_centre.update(opening_hours: jsonAddress)
    new_sports_centre.update(numberOfCourts: 6)
    # format the full_address from street_address, suburb, state and postcode
    new_rep = Representative.create!(rep_params)
    new_contact = Contact.create!(contact_params)
    if new_address.full_address.blank?
      full_address = "#{new_address.street_address}, #{new_address.suburb} #{new_address.state} #{new_address.postcode}"
      new_address.full_address = full_address;
    end
    # new_sports_centre.images.attach(params[:sports_centre][:images])
    if new_sports_centre.save! && new_address.save!
      debugger
      redirect_to admin_sports_centre_path(new_sports_centre)# show for sports_centre
    else
      render :new
    end
  end

  def delete
  end

  def index
    # console
    @sports_centres = SportsCentre.all
    @arr = ["Half-Court", "Full-Court"]
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
    #respond_to do |format|
    #  format.js
      # format.html
    # end
  end

  # same code as above but will load js.erb file instead of html
  def user_show
    console
    @arr = []
    @sports_centre = SportsCentre.find(params[:id])
    @bookings = @sports_centre.bookings.to_json.html_safe
    # date = !params[:date].nil? ? date_params : "no date provided"
    @date = date_params.to_json.html_safe

    @peak_hours = @sports_centre.peak_hours.to_json.html_safe
    @real_prices = @sports_centre.prices.to_json.html_safe

    # debugger
    respond_to do |format|
      format.js
      # format.html
    end
  end

  def booking_success
    @sports_centre = SportsCentre.find(params[:sports_centre_id])
  end

  def booking_cancelled
  end

  def booking_failure
  end

  private
    def sports_centre_params
        params.require(:sports_centre).permit(:title, :email, :password, :password_confirmation, :ABN, :phone, :description, images:[])
    end

    def address_params
        params.require(:sports_centre).permit(address: [:full_address, :street_address, :suburb, :state, :postcode])
    end

    def opening_hour_params
        params.require(:sports_centre).permit(:opening_hours)
    end

    def id_params
        params.permit(:id)
    end

    def date_params
        params.require(:date) #.require(:)
    end

    def rep_params
        params.require(:sports_centre).require(:representative).permit(:name, :address, :email, :title, :dob, :phone)
    end

    def contact_params
        params.require(:sports_centre).require(:contact).permit(:name, :email)
    end

    def token_params
        params.require(:sports_centre).permit(:token_account, :token_person)
    end
end
