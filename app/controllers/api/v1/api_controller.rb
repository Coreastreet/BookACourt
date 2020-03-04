class Api::V1::ApiController < ActionController::API
  helper_method :current_sports_centre

  def current_sports_centre
    if session[:centre_id]#$redis.get('centre_id')
      @current_sports_centre ||= SportsCentre.find(session[:centre_id])
    else
      @current_sports_centre = nil
    end
  end

end
