class WidgetChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "update_widget_#{current_user}"
    Rails.logger.info("subscribed to widget channel")
  end

  def unsubscribed
    Rails.logger.info("unsubscribed from widget channel")
    # Any cleanup needed when channel is unsubscribed
  end
end
