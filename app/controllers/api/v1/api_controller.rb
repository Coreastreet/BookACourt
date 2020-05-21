class Api::V1::ApiController < ActionController::API
  helper_method :current_sports_centre
  helper_method :valid_account

  def current_sports_centre
    if session[:centre_id]#$redis.get('centre_id')
      @current_sports_centre ||= SportsCentre.find(session[:centre_id])
    else
      @current_sports_centre = nil
    end
  end

  # that is on free trial or paid on time.
  def valid_account(sports_centre) # pass in current_sports_centre
      if sports_centre != nil
          return true if Date.current <= sports_centre.nextPaymentDue
      else
          return false
      end
  end

end
