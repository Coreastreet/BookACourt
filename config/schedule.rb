# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron
set :output, "log/cron_log.log"
#
# set :environment, :development

job_type :rbenv_rake, %Q{export PATH=/home/#{ENV["USER"]}/.rbenv/shims:/home/#{ENV["USER"]}/.rbenv/bin:/usr/bin:$PATH; eval "$(rbenv init -)"; \
                         cd :path && :environment_variable=:environment :bundle_command rake :task --silent :output }

# Example:
#


every 1.day, at: "11:55PM" do
  # rbenv_rake "sports_centre:updateYesterdayMoneyOwed"
  rbenv_rake "sports_centre:updateYesterdayMoneyOwedProduction"
end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever
