class NotificationsMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.notifications_mailer.signUp_confirmation.subject
  #
  def signUp_confirmation
    @user = params[:user]
    @url = "http://www.localhost:3000/login"
    mail(to: @user.email, subject: "BookACourt Sign-up Confirmation")
  end

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
    require 'barby/barcode/ean_13'
    require 'barby/outputter/png_outputter'
    barcode = Barby::EAN13.new(@order.transactionRefNo.to_s)
    File.open('app/assets/images/barcode.png', 'wb'){|f|
        f.write barcode.to_png(:height => 80, :margin => 20)
    }
    image = MiniMagick::Image.new('app/assets/images/barcode.png')
    image.resize "150%"
    image.crop "100%x72%+0+25"
    # send an email to the booker with details of the booking and the barcode.
    attachments.inline['barcode.png'] = File.read('app/assets/images/barcode.png')
    attachments.inline['hurstvilleAquatic.png'] = File.read('app/assets/images/hurstvilleAquatic.png')
    attachments.inline['calendar-icon.png'] = File.read('app/assets/images/calendar-icon.png')
    attachments.inline['location-icon.png'] = File.read('app/assets/images/location-icon.png')
    attachments.inline['card-icon.png'] = File.read('app/assets/images/card-icon.png')
    attachments.inline['teaGreenIcon.png'] = File.read('app/assets/images/teaGreenIcon.png')
    attachments.inline['greyBlueIcon.png'] = File.read('app/assets/images/greyBlueIcon.png')

    make_bootstrap_mail(to: @order.email_address, subject: "BookACourt Booking Invoice")
  end

end
