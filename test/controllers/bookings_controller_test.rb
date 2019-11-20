require 'test_helper'

class BookingsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get bookings_create_url
    assert_response :success
  end

  test "should get read" do
    get bookings_read_url
    assert_response :success
  end

  test "should get calculateRate" do
    get bookings_calculateRate_url
    assert_response :success
  end

end
