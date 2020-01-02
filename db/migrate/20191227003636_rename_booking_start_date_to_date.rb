class RenameBookingStartDateToDate < ActiveRecord::Migration[6.0]
  def change
    rename_column :bookings, :startDate, :date
  end
end
