class WidgetChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "updates_#{current_user}"
    Rails.logger.info("subscribed to widget channel")
  end

  def join
    ActionCable.server.broadcast "updates_#{current_user}", {
      message: "Another booking has been made!",
    }
    Rails.logger.info("update sent")
  end

  def unsubscribed
    Rails.logger.info("unsubscribed from widget channel")
    # Any cleanup needed when channel is unsubscribed
  end
end
