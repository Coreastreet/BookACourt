class RemoveUsersFromBookings < ActiveRecord::Migration[6.0]
  def change
    remove_reference :bookings, :users, null: false, foreign_key: false
  end
end
