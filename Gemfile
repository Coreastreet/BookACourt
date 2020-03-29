source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.7.0'

gem 'dotenv-rails', :groups => [:development, :test]
# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 6.0.0'
## Use postgresql as the database for Active Record
gem 'pg', '>= 0.18', '< 2.0'
# Use Puma as the app server
# gem 'puma', '~> 3.11'
gem "passenger", ">= 5.3.2", require: "phusion_passenger/rack_handler"

# Use SCSS for stylesheets
gem 'sass-rails', '~> 5'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker', '~> 4.2.0'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.7'
# Use Redis adapter to run Action Cable in production
gem 'redis', '~> 4.0'

gem 'redis-rails'

# Use Active Model has_secure_password
gem 'bcrypt', '~> 3.1.7'

# for storing pics in cloud
gem 'activestorage-backblaze', '~> 0.0.5'
# gem 'google-cloud-storage', '>= 1.25.1', require: false
# add gem 'bootstrap' for css framework
# gem 'bootstrap',  '~>4.3.1
# gem 'redis', '~> 3.3', '>= 3.3.1'
gem 'rack-cors', '~> 1.1.1'

gem 'inky-rb', require: 'inky'

gem 'premailer-rails', '~> 1.9', '>= 1.9.2'
# gem 'devise' for authentication
# gem 'dotenv-rails'
gem 'bootstrap-email'
# for generating barcodes
gem 'barby', '~> 0.6.8'
gem 'rqrcode', '~> 0.10.1'
# for writing to image files
gem 'chunky_png', '~> 1.3', '>= 1.3.5'

# edit and transform images
gem 'mini_magick', '~> 4.5', '>= 4.5.1'

# to prevent csrf errors
gem 'jquery-rails'

# adding fount awesome icons
gem 'font-awesome-rails'

gem 'simple_form'

gem "geocoder"
gem "figaro"

gem 'pry', '~> 0.10.3'

gem 'activerecord-session_store'

# capistrano for deployment
gem 'capistrano', '~> 3.11'
gem 'capistrano-rails', '~> 1.4'
gem 'capistrano-rails-db'

gem 'capistrano-figaro', '~> 1.0'

gem 'capistrano-passenger', '~> 0.2.0'
gem 'capistrano-rbenv', '~> 2.1', '>= 2.1.4'

gem 'bootstrap-sass'
# Use Active Storage variant
# gem 'image_processing', '~> 1.2'
gem 'bootstrap-datepicker-rails', :require => 'bootstrap-datepicker-rails',
                              :git => 'git://github.com/Nerian/bootstrap-datepicker-rails.git'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.2', require: false

# rest-client for making https requests
gem 'rest-client', '~> 2.1'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  # generate model entity-relationship diagrams
  gem "rails-erd"
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '>= 2.15'
  gem 'selenium-webdriver'
  # Easy installation and use of web drivers to run system tests with browsers
  gem 'webdrivers'
end

gem 'whenever', '~> 0.9.4'
# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
