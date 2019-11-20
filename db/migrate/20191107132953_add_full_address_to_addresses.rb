class AddFullAddressToAddresses < ActiveRecord::Migration[6.0]
  def change
    add_column  :addresses, :full_address, :string
  end
end
