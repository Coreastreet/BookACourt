class Api::V1::SportsCentresController < Api::V1::ApiController

  CHARS = ('0'..'9').to_a + ('A'..'Z').to_a + ('a'..'z').to_a

  def confirm_email
    require "base64"
    decodedKey = Base64.decode64(key_params[:key])
    sports_centre = SportsCentre.find(params[:id])
    if (sports_centre.combinedCode == decodedKey && sports_centre.confirmed == false)
        # confirm the email address and set confirmed to true
        sports_centre.update!(confirmed: true)
        $redis.set("centre_id", sports_centre.id)
        redirect_to admin_sports_centre_path(sports_centre)
    else
        redirect_to root_path
    end

  end

  private

  def key_params
    params.permit(:key)
  end

  def random_password(length=10)
    CHARS.sort_by { rand }.join[0...length]
  end

end
