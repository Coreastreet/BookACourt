class RemoveGuestFromBookings < ActiveRecord::Migration[6.0]
  def change
    remove_reference :bookings, :guest, null: false, foreign_key: true
  end
end
