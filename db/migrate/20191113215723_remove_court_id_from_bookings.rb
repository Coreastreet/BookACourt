class RemoveCourtIdFromBookings < ActiveRecord::Migration[6.0]
  def change
    remove_reference :bookings, :courts, null: false
  end
end
