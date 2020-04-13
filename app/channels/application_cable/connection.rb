module ApplicationCable
  class Connection < ActionCable::Connection::Base
  	 identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

	  def find_verified_user
	    if verified_centre_admin = cookies.signed[:centre_id]#$redis.get("centre_id")
	      verified_centre_admin
	    elsif verified_widget_user = cookies.signed[:widget_centre_id]
        verified_widget_user
      else
	      reject_unauthorized_connection
	    end
	  end
  end
end
