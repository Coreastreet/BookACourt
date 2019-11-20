class AddSportsCentreToBookings < ActiveRecord::Migration[6.0]
  def change
    add_reference :bookings, :sports_centre, null: false, foreign_key: true
  end
end
