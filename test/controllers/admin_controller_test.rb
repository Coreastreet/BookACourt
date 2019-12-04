require 'test_helper'

class AdminControllerTest < ActionDispatch::IntegrationTest
  test "should get createPeakHours" do
    get admin_createPeakHours_url
    assert_response :success
  end

  test "should get editPeakHours" do
    get admin_editPeakHours_url
    assert_response :success
  end

end
