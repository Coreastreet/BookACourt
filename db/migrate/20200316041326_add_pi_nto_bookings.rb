class AddPiNtoBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :pin, :integer
  end
end
