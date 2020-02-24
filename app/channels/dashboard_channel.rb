class DashboardChannel < ApplicationCable::Channel
  def subscribed
  	sportsCentre = SportsCentre.find(params[:sports_centre_id])
    stream_for sportsCentre
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
