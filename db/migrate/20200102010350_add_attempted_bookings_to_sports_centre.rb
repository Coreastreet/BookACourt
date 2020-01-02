class AddAttemptedBookingsToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :attemptedBookings, :integer, default: 0
  end
end
