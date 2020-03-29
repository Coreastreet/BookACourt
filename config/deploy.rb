# config valid for current version and patch releases of Capistrano
lock "~> 3.12.0"

set :application, "BookACourt"
set :repo_url, "https://Coreastreet:Soba3724@github.com/Coreastreet/BookACourt"

set :passenger_restart_with_touch, true
set :bundle_without, %w{test}.join(' ')

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, "/home/deploy/rails/#{fetch :application}"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true
# set :linked_files, %w{config/master.key}
# Default value for :linked_files is []
# append :linked_files, "config/database.yml"

# Default value for linked_dirs is []
append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "vendor/bundle", ".bundle", "public/system", "public/uploads"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
set :keep_releases, 3

set :pg_without_sudo, false
set :pg_database, 'BookACourt'
set :pg_username, 'justin'
set :pg_ask_for_password, true

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure
namespace :deploy do
  namespace :db do
    desc "Load the database schema if needed"
    task load: [:set_rails_env] do
      on primary :db do
        if not test(%Q[[ -e "#{shared_path.join(".schema_loaded")}" ]])
          within release_path do
            with rails_env: fetch(:rails_env) do
              execute :rake, "db:schema:load"
              execute :touch, shared_path.join(".schema_loaded")
            end
          end
        end
      end
    end
  end

  before "deploy:db:migrate", "deploy:db:load"
end
