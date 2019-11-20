class SessionsController < ApplicationController
    def new
      # No need for anything in here, we are just going to render our
      # new.html.erb AKA the login page
      console
    end

    def create
      # Look up User in db by the email address submitted to the login form and
      # convert to lowercase to match email in db in case they had caps lock on:
      user = User.find_by(email: params[:login][:email].downcase)

      # Verify user exists in db and run has_secure_password's .authenticate()
      # method to see if the password submitted on the login form was correct:
      if user && user.authenticate(params[:login][:password])
        # Save the user.id in that user's session cookie:
        session[:user_id] = user.id.to_s
        redirect_to root_path
      end
    end

    def destroy
      # delete the saved user_id key/value from the cookie:
      session.delete(:user_id)

      # no need for format.js right now
      respond_to do |format|
        format.html { redirect_to root_path }
        format.js
      end
    end
end
