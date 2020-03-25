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
    require 'base64'
    title = address_params[:full_address].split(",")[0]
    if SportsCentre.exists?(email: sports_centre_params[:email])
      redirect_to login_path, alert: "An account with this company email already exists" # account already exists
      return
    end
    new_sports_centre = SportsCentre.new(sports_centre_params)

    new_address = Address.new(address_params)
    new_sports_centre.address = new_address

    new_sports_centre.update!(title: title)
    #puts(token_params)
    #new_sports_centre.email.downcase!
    # create the final auth key
    combinedCode = "#{sports_centre_params[:merchantCode]}:#{sports_centre_params[:authenticationCode]}"
    encoded = Base64.encode64(combinedCode).chomp
    finalAuthCode = "Basic #{encoded}"
    new_sports_centre.update(combinedCode: finalAuthCode, lastPayDate: Date.current)

    #new_sports_centre.update(address: new_address)
    empty_opening_hours = {
      "Sun": {"openingHour": "", "closingHour": ""},
      "Mon": {"openingHour": "", "closingHour": ""},
      "Tue": {"openingHour": "", "closingHour": ""},
      "Wed": {"openingHour": "", "closingHour": ""},
      "Thu": {"openingHour": "", "closingHour": ""},
      "Fri": {"openingHour": "", "closingHour": ""},
      "Sat": {"openingHour": "", "closingHour": ""}
    }

    empty_peak_hours = {
      "Sun": {"startingPeakHour": "", "closingPeakHour": ""},
      "Mon": {"startingPeakHour": "", "closingPeakHour": ""},
      "Tue": {"startingPeakHour": "", "closingPeakHour": ""},
      "Wed": {"startingPeakHour": "", "closingPeakHour": ""},
      "Thu": {"startingPeakHour": "", "closingPeakHour": ""},
      "Fri": {"startingPeakHour": "", "closingPeakHour": ""},
      "Sat": {"startingPeakHour": "", "closingPeakHour": ""},
    }

    new_sports_centre.opening_hours = empty_opening_hours;
    new_sports_centre.peak_hours = empty_peak_hours;
    # new_sports_centre.update(email: "blah4@gmail.com") # add form row for email, will be used as username
    #new_sports_centre.update(password: "Soba3724") # send password for immediate reset
    # move opening hours and images to dashboard

    #new_sports_centre.images.attach(params[:sports_centre][:images])
    # convert the string of opening hours to json before assignment
    #jsonAddress = JSON.parse(opening_hour_params[:opening_hours])
    # new_sports_centre.update(opening_hours: jsonAddress)
    #new_sports_centre.update(numberOfCourts: 6) # add form row for user to select number of courts
    # format the full_address from street_address, suburb, state and postcode
    new_rep = Representative.create!(rep_params)
    new_rep_address = Address.create(rep_address_params)
    new_rep.update!(address: new_rep_address)
    admin_password = pin4_generate.to_s
    new_rep.update!(password: admin_password)

    new_sports_centre.representative = new_rep
    if contact_params
      contact_params.each do |contact|
         new_sports_centre.contacts << Contact.create!(contact)
      end
    end

    if new_address.full_address.blank?
      full_address = "#{new_address.street_address}, #{new_address.suburb} #{new_address.state} #{new_address.postcode}"
      new_address.full_address = full_address;
    end
    # new_sports_centre.images.attach(params[:sports_centre][:images])
    if new_sports_centre.save! && new_address.save
      redirect_to login_path, notice: "An account activation link has been sent to your company email."# admin_sports_centre_path(new_sports_centre) show for sports_centre
      # send mail containing first time access password
      matchdata = request.url.match(/^(http|https):\/\/[^\/]*/)
      NotificationsMailer.with(sports_centre: new_sports_centre, new_rep: new_rep, adminPin: admin_password).provide_admin_pin.deliver_later

      NotificationsMailer.with(sports_centre: new_sports_centre, origin_url: matchdata[0]).signUp_confirmation.deliver_later
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
    # $redis.client.disconnect
    #Redis.current.set("A", "1")
    #generate_qrCode
  end

  # same code as above but will load js.erb file instead of html
  def user_show
    # console
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

  def check_availability
    sportsCentre = SportsCentre.find(params[:id])
    @startTime = interval_params[:startTime]
    @endTime = interval_params[:endTime]
    @courtType = interval_params[:courtType]

    @interval_in_days = interval_params[:dayInterval]
    @date = interval_params[:date]
    # use redis for faster data retrieval
    #if ($redis.get("allBookings") == nil)
    @json_bookings = sportsCentre.bookings.to_json
    #  $redis.set("allBookings", @json_bookings)
    #else
    @numberOfCourts = sportsCentre.numberOfCourts
    #  @json_bookings = $redis.get("allBookings")
    #end
    respond_to do |format|
      format.js
    end
  end

  def booking_success
    @sports_centre = SportsCentre.find(params[:sports_centre_id])
    url = "https://poliapi.apac.paywithpoli.com/api/v2/Transaction/GetTransaction?token=" + booking_token_params[:token]
    response = RestClient.get url, {Authorization: @sports_centre.combinedCode}
    parsed_response = JSON.parse(response)

    merchantData = JSON.parse(parsed_response["MerchantData"])
    @customerEmail = merchantData["order"]["customerEmail"]
  end

  def booking_cancelled
  end

  def booking_failure

  end

  private

    def pin4_generate
      require "securerandom"
      (SecureRandom.random_number(9e3) + 1e3).to_i
    end

    def sports_centre_params
        params.require(:sports_centre).permit(:title, :email, :password, :password_confirmation, :ABN, :URL,
           :numberOfCourts, :phone, :description, :logo, :merchantCode, :authenticationCode)
    end

    def address_params
        params.require(:sports_centre).require(:address).permit(:full_address, :street_address, :suburb, :state, :postcode)
    end

    def opening_hour_params
        params.require(:sports_centre).permit(:opening_hours)
    end

    def id_params
        params.permit(:id)
    end

    def interval_params
      params.permit(:dayInterval, :id, :date, :startTime, :endTime, :courtType)
    end

    def date_params
        params.require(:date) #.require(:)
    end

    def rep_params
        params.require(:sports_centre).require(:representative).permit(:name, :email, :title, :dob, :phone, :isOwner, :isDirector)
    end

    def rep_address_params
        params.require(:sports_centre).require(:representative).require(:address).permit!
    end

    def contact_params
        if params[:arrayContacts]
          JSON.parse(params.require(:arrayContacts))
        end
    end

    def token_params
        params.require(:sports_centre).permit(:token_account, :token_person)
    end

    def booking_token_params
      params.permit(:token, :sports_centre_id)
    end
end
