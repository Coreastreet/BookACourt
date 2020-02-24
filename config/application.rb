require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module BookACourt
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

  #  config.action_dispatch.default_headers = {
#      'Access-Control-Allow-Origin' => '*',
#      'Access-Control-Request-Method' => %w{GET POST OPTIONS}.join(",")
#    }
    config.assets.paths << "#{Rails.root}/app/assets/videos"

      config.middleware.insert_before 0, Rack::Cors do
       allow do
         origins '*'
         resource(
           '*',
           headers: :any,
           methods: [:get, :patch, :put, :delete, :post, :options]
           )
       end
     end
    # needed to provide a reference to images sent in email
    # config.action_controller.asset_host = 'https://59e4da6c.ngrok.io'
    # config.action_mailer.asset_host = config.action_controller.asset_host
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.
  end
end
