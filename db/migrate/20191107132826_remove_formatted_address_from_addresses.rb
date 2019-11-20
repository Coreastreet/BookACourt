class RemoveFormattedAddressFromAddresses < ActiveRecord::Migration[6.0]
  def change
    remove_column :addresses, :formattedAddress
  end
end
