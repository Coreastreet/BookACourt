class ChangeColumnNullForBookings < ActiveRecord::Migration[6.0]
  def change
    change_column :bookings, :users_id, :integer, :null => true
    change_column :bookings, :guest_id, :integer, :null => true
  end
end
