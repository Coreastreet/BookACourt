class ChangeTransactionRefNoToBigInt < ActiveRecord::Migration[6.0]
  def change
    change_column :orders, :transactionRefNo, :bigint
  end
end
