require 'test_helper'

class NotificationsMailerTest < ActionMailer::TestCase
  test "signUp_confirmation" do
    mail = NotificationsMailer.signUp_confirmation
    assert_equal "Signup confirmation", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end

  test "forgot_password" do
    mail = NotificationsMailer.forgot_password
    assert_equal "Forgot password", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end

  test "booking_invoice" do
    mail = NotificationsMailer.booking_invoice
    assert_equal "Booking invoice", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end

end
