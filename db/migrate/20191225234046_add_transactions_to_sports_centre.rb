class AddTransactionsToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :transactions, :integer, default: 0
  end
end
