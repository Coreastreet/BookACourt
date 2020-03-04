class RemoveRelationShipFromContact < ActiveRecord::Migration[6.0]
  def change
    remove_column :contacts, :relationship, :integer
  end
end
