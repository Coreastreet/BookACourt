require 'test_helper'

class GuestsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get guests_create_url
    assert_response :success
  end

  test "should get delete" do
    get guests_delete_url
    assert_response :success
  end

end
