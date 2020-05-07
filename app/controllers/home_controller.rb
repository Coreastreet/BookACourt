class HomeController < ApplicationController
  def index
    # console
  end

  def about
  end

  def demo
  end

  def status_callback
    @params = params
    Rails.logger.info @params.inspect
  end
end
