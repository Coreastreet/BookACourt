class RemoveIntervalFromBooking < ActiveRecord::Migration[6.0]
  def change
    remove_column :bookings, :interval, :integer
  end
end
