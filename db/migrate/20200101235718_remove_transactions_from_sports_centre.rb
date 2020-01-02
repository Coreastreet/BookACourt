class RemoveTransactionsFromSportsCentre < ActiveRecord::Migration[6.0]
  def change
    remove_column :sports_centres, :transactions, :integer, default: 0
  end
end
