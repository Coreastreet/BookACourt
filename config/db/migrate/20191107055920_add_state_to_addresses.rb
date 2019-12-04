class AddStateToAddresses < ActiveRecord::Migration[6.0]
  def change
    add_column :addresses, :state, :integer
  end
end
