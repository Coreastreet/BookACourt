class ChangeTransactionToOrder < ActiveRecord::Migration[6.0]
  def change
    rename_table :transactions, :orders
  end
end
