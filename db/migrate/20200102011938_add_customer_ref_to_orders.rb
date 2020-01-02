class AddCustomerRefToOrders < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :customerRef, :string
  end
end
