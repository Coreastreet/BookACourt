# Preview all emails at https://weball.com.au/rails/mailers/notifications_mailer
class NotificationsMailerPreview < ActionMailer::Preview

  # Preview this email at https://weball.com.au/rails/mailers/notifications_mailer/signUp_confirmation
  def signUp_confirmation
    NotificationsMailer.with(sports_centre: SportsCentre.first).signUp_confirmation
  end

  # Preview this email at https://weball.com.au/rails/mailers/notifications_mailer/forgot_password
  def forgot_password
    NotificationsMailer.forgot_password
  end

  # Preview this email at https://weball.com.au/rails/mailers/notifications_mailer/booking_invoice
  def booking_invoice
    NotificationsMailer.with(sports_centre: SportsCentre.first, order: Order.first).booking_invoice
  end

  # Preview this email at https://weball.com.au/rails/mailers/notifications_mailer/provide_admin_pin
  def provide_admin_pin
    NotificationsMailer.with(sports_centre: SportsCentre.first, new_rep: Representative.last, adminPin: "3724").provide_admin_pin
  end

  # Preview this email at https://weball.com.au/rails/mailers/notifications_mailer/transaction_fee_invoice
  def transaction_fee_invoice
    NotificationsMailer.with(sports_centre: SportsCentre.first, amountPaid: 32.00, poliId: "345678976543").transaction_fee_invoice
  end


end
