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

  def pricing_plans
  end

  def how_weball_works
  end

  def setup_weball_guide
  end
end
