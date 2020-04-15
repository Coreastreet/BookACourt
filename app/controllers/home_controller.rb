class HomeController < ApplicationController
  include ActionController::Live

  def index
    # console
  end

  def about
  end

  def demo
  end

  def demo_update
    response.headers['Content-Type'] = 'text/event-stream'
    sse = SSE.new(response.stream, retry: 5000)
    id = 0
    @demo_sports_centre = SportsCentre.find(114)
    begin
        @demo_sports_centre.on_bookings_change do |sports_centre_id|
          #if (status == "new_booking")
            @bookings = @demo_sports_centre.bookings.to_json.html_safe
            sse.write({ bookings: @bookings }, id: id, event: "demo_update")
            id = id + 1
            #sse.write({ name: status }, id: 10, event: "demo_update")
        end
    rescue ClientDisconnected
    ensure
      sse.close
    end
  end
end
