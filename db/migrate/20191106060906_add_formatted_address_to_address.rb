class AddFormattedAddressToAddress < ActiveRecord::Migration[6.0]
  def change
    add_column :addresses, :formattedAddress, :string
  end
end
