namespace :sports_centre do
  desc "TODO"
  task updateYesterdayMoneyOwed: :environment do
    SportsCentre.all.each do |sports_centre|
      moneyOwed = sports_centre.moneyOwed
      sports_centre.update!(yesterdayMoneyOwed: moneyOwed)
    end
  end
end
