class SessionsController < ApplicationController
    def new
      # No need for anything in here, we are just going to render our
      # new.html.erb AKA the login page
      #console
    end

    def create
      # check if user login or sports_centre login filled
      if user_params
          # Look up User in db by the email address submitted to the login form and
          # convert to lowercase to match email in db in case they had caps lock on:
          user = User.find_by(email: params[:user][:email].downcase)

          # Verify user exists in db and run has_secure_password's .authenticate()
          # method to see if the password submitted on the login form was correct:
          if user && user.authenticate(params[:user][:password])
            # Save the user.id in that user's session cookie:
            session[:user_id] = user.id
            redirect_to root_path
          else
            raise "cannot login as user"
          end
      elsif sports_centre_params
          sports_centre = SportsCentre.find_by(email: params[:sports_centre][:email].downcase)
          if sports_centre && sports_centre.authenticate(params[:sports_centre][:password])
            if (sports_centre.confirmed) # representative has verified the email
              #$redis.set('centre_id', sports_centre.id.to_s)
              session[:centre_id] = sports_centre.id
              cookies.signed[:centre_id] = sports_centre.id
              current_sports_centre = current_sports_centre
              redirect_to admin_sports_centre_path(sports_centre)
            else
              flash.now[:alert] = "Sports Centre email is not confirmed yet"
              render "new"
              #raise "sports centre email not confirmed yet"
            end
            # Save the user.id in that user's session cookie:
          else
            if sports_centre
              flash.now[:alert] = "Password is incorrect. Try again."
            else
              flash.now[:alert] = "Email Address is incorrect. Try again."
            end
            render "new"
          end
      end
    end

    def destroy
      # check if sign out is by a user or sports_centre
      if session[:user_id]
        # delete the saved user_id key/value from the cookie:
        session.delete(:user_id)
        # no need for format.js right now
        respond_to do |format|
          format.html { redirect_to root_path }
          format.js
        end
      elsif session[:centre_id]
        session.delete(:centre_id)
        cookies.delete(:centre_id)
        respond_to do |format|
          format.html { redirect_to root_path }
          format.js
        end
      end
    end

    private

    def user_params
      if params[:user]
        params.require(:user).permit(:email, :password)
      end
    end

    def sports_centre_params
      if params[:sports_centre]
        params.require(:sports_centre).permit(:email, :password)
      end
    end
end
