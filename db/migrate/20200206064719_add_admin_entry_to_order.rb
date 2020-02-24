class AddAdminEntryToOrder < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :adminEntry, :boolean
  end
end
