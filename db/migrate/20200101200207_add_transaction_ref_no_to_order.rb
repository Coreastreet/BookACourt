class AddTransactionRefNoToOrder < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :transactionRefNo, :integer
  end
end
