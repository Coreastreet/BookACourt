class Api::V1::ApiController < ActionController::API
  helper_method :current_sports_centre

  def current_sports_centre
    if $redis.get('centre_id')
      @current_sports_centre ||= SportsCentre.find($redis.get("centre_id"))
    else
      @current_sports_centre = nil
    end
  end

end
