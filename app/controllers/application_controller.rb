class ApplicationController < ActionController::Base
  protect_from_forgery prepend: true
  # ----- add these lines here: -----

  # Make the current_user method available to views also, not just controllers:
  helper_method :current_user
  helper_method :current_sports_centre
  helper_method :logged_in_as_user?
  helper_method :logged_in_as_sports_centre?
  helper_method :logged_out?

  # Define the current_user method:
  def current_user
    # Look up the current user based on user_id in the session cookie:
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def current_sports_centre
    if session[:centre_id]#$redis.get('centre_id')
      @current_sports_centre ||= SportsCentre.find(session[:centre_id])#$redis.get("centre_id"))
    else
      @current_sports_centre = nil
    end
  end

  def logged_in_as_user?
    !!current_user
  end

  def logged_in_as_sports_centre?
    !!current_sports_centre
  end

  def logged_out?
    (session[:user_id].nil?) && (session[:centre_id].nil?)
  end
end
