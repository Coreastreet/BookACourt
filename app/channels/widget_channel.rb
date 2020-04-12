class WidgetChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    Rails.logger.info("subscribed to widget channel")
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
