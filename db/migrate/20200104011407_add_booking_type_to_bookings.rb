class AddBookingTypeToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :bookingType, :integer
  end
end
