class AddTransactionRateToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :transactionRate, :decimal, default: 0, precision: 10, scale: 4
  end
end
