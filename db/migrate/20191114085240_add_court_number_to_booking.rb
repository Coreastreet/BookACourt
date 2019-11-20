class AddCourtNumberToBooking < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :court_no, :integer
  end
end
