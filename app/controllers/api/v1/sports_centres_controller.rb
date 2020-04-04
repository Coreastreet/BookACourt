class Api::V1::SportsCentresController < Api::V1::ApiController

  CHARS = ('0'..'9').to_a + ('A'..'Z').to_a + ('a'..'z').to_a

  def confirm_email
    require "base64"
    decodedKey = Base64.decode64(key_params[:key])
    sports_centre = SportsCentre.find(params[:id])
    if (sports_centre.combinedCode == decodedKey && sports_centre.confirmed == false)
        # confirm the email address and set confirmed to true
        sports_centre.update!(confirmed: true)
        session[:centre_id] = sports_centre.id#$redis.set("centre_id", sports_centre.id)
        redirect_to admin_sports_centre_path(sports_centre)
    else
        redirect_to login_path
    end

  end

  def payment_nudge
    require "json"
    require "restclient"
    url = "https://poliapi.apac.paywithpoli.com/api/v2/Transaction/GetTransaction?token=" + token_params[:Token]
    response = RestClient.get url, {Authorization: "Basic UzYxMDQ2ODk6RWQ2QCRNYjM0Z14="}
    parsed_response = JSON.parse(response)

    current_sports_centre = SportsCentre.find(token_params[:id])
    # if the transaction is successful,
    # create the booking
    if (parsed_response["TransactionStatus"] == "Completed")
        transactionRefNo = parsed_response["TransactionRefNo"]

        moneyPaid = current_sports_centre.moneyPaid
        moneyOwed = current_sports_centre.moneyOwed
        yesterdayMoneyOwed = current_sports_centre.yesterdayMoneyOwed
        amountPaid = parsed_response["AmountPaid"].to_d

        numberOfBookingFeesPaid = current_sports_centre.bookings.where(created_at: (current_sports_centre.lastPayDate)...(Date.current)).count
        current_sports_centre.update!(yesterdayMoneyOwed: yesterdayMoneyOwed - amountPaid,
          moneyPaid: moneyPaid + amountPaid,
          moneyOwed: moneyOwed - amountPaid,
          lastPayDate: Date.current) # all fees paid up to but not inclusive of this date
        # reset the money owed up to yesterday to Zero;
        # increase the money paid by the amount paid;
        # decrease the amount of money owed by the amount paid.

        Payment.create!(amountPaid: amountPaid, poliId: transactionRefNo, planType: current_sports_centre.plan,
            numberOfBookingFeesPaid: numberOfBookingFeesPaid, sports_centre_id: current_sports_centre.id)

        NotificationsMailer.with(sports_centre: current_sports_centre, amountPaid: amountPaid, poliId: transactionRefNo).transaction_fee_invoice.deliver_later

    end
  end

  private

  def key_params
    params.permit(:key)
  end

  def token_params
    params.permit(:Token, :id)
  end


  def random_password(length=10)
    CHARS.sort_by { rand }.join[0...length]
  end

end
