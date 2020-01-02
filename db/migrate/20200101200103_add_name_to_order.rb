class AddNameToOrder < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :fullName, :string
  end
end
