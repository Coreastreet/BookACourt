# Preview all emails at http://localhost:3000/rails/mailers/notifications_mailer
class NotificationsMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/notifications_mailer/signUp_confirmation
  def signUp_confirmation
    NotificationsMailer.with(sports_centre: SportsCentre.first).signUp_confirmation
  end

  # Preview this email at http://localhost:3000/rails/mailers/notifications_mailer/forgot_password
  def forgot_password
    NotificationsMailer.forgot_password
  end

  # Preview this email at http://localhost:3000/rails/mailers/notifications_mailer/booking_invoice
  def booking_invoice
    NotificationsMailer.with(sports_centre: SportsCentre.first, order: Order.first).booking_invoice
  end

end
