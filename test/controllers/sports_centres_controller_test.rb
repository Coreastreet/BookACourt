require 'test_helper'

class SportsCentresControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get sports_centres_create_url
    assert_response :success
  end

  test "should get delete" do
    get sports_centres_delete_url
    assert_response :success
  end

  test "should get index" do
    get sports_centres_index_url
    assert_response :success
  end

  test "should get read" do
    get sports_centres_read_url
    assert_response :success
  end

  test "should get edit" do
    get sports_centres_edit_url
    assert_response :success
  end

end
