class RemoveCostFromBooking < ActiveRecord::Migration[6.0]
  def change
    remove_column :bookings, :cost, :decimal
  end
end
