class AddCourtTypeToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :courtType, :integer
  end
end
