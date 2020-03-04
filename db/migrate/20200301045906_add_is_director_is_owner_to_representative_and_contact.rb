class AddIsDirectorIsOwnerToRepresentativeAndContact < ActiveRecord::Migration[6.0]
  def change
    add_column :representatives, :isOwner, :boolean
    add_column :representatives, :isDirector, :boolean
    add_column :contacts, :isOwner, :boolean
    add_column :contacts, :isDirector, :boolean
  end
end
