namespace :sports_centre do
  desc "TODO"
  task updateYesterdayMoneyOwed: :environment do
    ActiveRecord::Base.establish_connection(
      adapter: "postgresql",
      encoding: "unicode",
      username: "justin",
      password: "Soba3724",
      database: "BookACourt_development"
    )
    SportsCentre.all.each do |sports_centre|
      moneyOwed = sports_centre.moneyOwed
      sports_centre.update!(yesterdayMoneyOwed: moneyOwed)
    end
  end

  desc "TODO in production"
  task updateYesterdayMoneyOwedProduction: :environment do
    ActiveRecord::Base.establish_connection(
      adapter: "postgresql",
      encoding: "unicode",
      username: "justin",
      password: "justin",
      database: "BookACourt_development"
    )
    SportsCentre.all.each do |sports_centre|
      moneyOwed = sports_centre.moneyOwed
      sports_centre.update!(yesterdayMoneyOwed: moneyOwed)
    end
  end
end
