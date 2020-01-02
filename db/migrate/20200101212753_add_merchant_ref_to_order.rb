class AddMerchantRefToOrder < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :merchantRef, :string
  end
end
