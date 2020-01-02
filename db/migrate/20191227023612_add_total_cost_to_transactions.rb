class AddTotalCostToTransactions < ActiveRecord::Migration[6.0]
  def change
    add_column :transactions, :TotalCost, :decimal
  end
end
