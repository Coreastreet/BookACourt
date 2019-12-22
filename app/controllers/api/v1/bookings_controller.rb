class Api::V1::BookingsController < Api::V1::ApiController

  def create
  end

  def show
    require "rest-client"
    require "json"

    url = "https://poliapi.apac.paywithpoli.com/api/v2/Transaction/GetTransaction?token=" + token_params[:token]
    response = RestClient.get url, {Authorization: ENV["POLIPAY_AUTH"]}
    pretty_response = JSON.pretty_generate(JSON.parse(response))

    byebug
  end

private

  def token_params
    params.permit(:token)
  end

end
