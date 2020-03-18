class AddYesterdayMoneyOwedToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :yesterdayMoneyOwed, :decimal, default: 0.00
  end
end
