class NotificationsMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.notifications_mailer.signUp_confirmation.subject
  #
  #def signUp_confirmation
  #  @user = params[:user]
  #  @url = "http://www.localhost:3000/login"
  #  mail(to: @user.email, subject: "BookACourt Sign-up Confirmation")
  #end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.notifications_mailer.forgot_password.subject
  #
  def forgot_password
    @greeting = "Hi"

    mail to: "to@example.org"
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.notifications_mailer.booking_invoice.subject
  #
  def booking_invoice
    # get details of the order
    @order = params[:order]
    # get details of the booking
    @bookings = @order.bookings
    # save both the variables to the booking object above but only display the reference number
    # use the transactionReference] via barcode encodding, no need to display
    # get the sports_Centre
    #@sports_centre = SportsCentre.find(params[:sports_centre_id])
    # generate a 1D barcode encoding the transactionRefNo
    @sports_centre = params[:sports_centre]
    #require 'barby/barcode/ean_13'
    #require 'barby/outputter/png_outputter'
    # generate_qrCode(@order.transactionRefNo.to_s)
    #barcode = Barby::EAN13.new(@order.transactionRefNo.to_s)
    #File.open('app/assets/images/barcode.png', 'wb'){|f|
    #    f.write barcode.to_png(:height => 80, :margin => 20)
    #}
    #image = MiniMagick::Image.new('app/assets/images/barcode.png')
    #image.resize "150%"
    #image.crop "100%x72%+0+25"
    # send an email to the booker with details of the booking and the barcode.
    # attachments.inline['qrCode.png'] = File.read('app/assets/images/qrCode.png')
    attachments.inline['eppingLogo.png'] = File.read('app/assets/images/logos/eppingLogo.png')
    attachments.inline['calendar-icon.png'] = File.read('app/assets/images/email_icons/calendar-icon.png')
    attachments.inline['location-icon.png'] = File.read('app/assets/images/email_icons/location-icon.png')
    attachments.inline['card-icon.png'] = File.read('app/assets/images/email_icons/card-icon.png')
    attachments.inline['teaGreenIcon.png'] = File.read('app/assets/images/email_icons/teaGreenIcon.png')
    attachments.inline['greyBlueIcon.png'] = File.read('app/assets/images/email_icons/greyBlueIcon.png')

    @logo_url = @sports_centre.logo.blob.key
    #attachments.inline['logo.png'] = File.read(logo_url)

    make_bootstrap_mail(to: @order.email_address, subject: "Weball: Booking Invoice")
  end

  def signUp_confirmation
    require "base64"
    @sports_centre = params[:sports_centre]
    domain_url = params[:origin_url]
    #create a notification url
    @pin = @sports_centre.pin
    paramsCode = Base64.encode64(@pin.to_s)
    @confirmation_url = "#{domain_url}/api/v1/sports_centres/#{@sports_centre.id}/confirm_email?key=#{paramsCode}"

    attachments.inline['weballText.png'] = File.read('app/assets/images/weballText.png')

    make_bootstrap_mail(to: @sports_centre.email, subject: "WeBall: Confirm your company email address!")
  end

  def provide_admin_pin
    @sports_centre = params[:sports_centre]
    #@new_rep = params[:new_rep]
    #@admin_password = params[:adminPin]

    attachments.inline['weballText.png'] = File.read('app/assets/images/weballText.png')

    make_bootstrap_mail(to: @sports_centre.email, subject: "WeBall: Your Administrator PIN")
  end

  def transaction_fee_invoice
    @amountPaid = params[:amountPaid]
    @sports_centre = params[:sports_centre]
    @poliId = params[:poliId]

    attachments.inline['weballText.png'] = File.read('app/assets/images/weballText.png')

    make_bootstrap_mail(to: @sports_centre.email, subject: "WeBall: Payment Invoice")
  end

  def payment_invoice

    make_bootstrap_mail(to: @sports_centre.email, subject: "BookACourt Booking Invoice")
  end

  private

  def generate_qrCode(content)
    require 'rqrcode'

    qrcode = RQRCode::QRCode.new(content)

    # NOTE: showing with default options specified explicitly
    png = qrcode.as_png(
      bit_depth: 1,
      border_modules: 4,
      color_mode: ChunkyPNG::COLOR_GRAYSCALE,
      color: 'black',
      file: nil,
      fill: 'white',
      module_px_size: 6,
      resize_exactly_to: false,
      resize_gte_to: false,
      size: 120
    )
    #binding.pry
    png.save("app/assets/images/qrCode.png")
  end

end
