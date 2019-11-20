require 'test_helper'

class CourtsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get courts_create_url
    assert_response :success
  end

  test "should get delete" do
    get courts_delete_url
    assert_response :success
  end

  test "should get index" do
    get courts_index_url
    assert_response :success
  end

end
