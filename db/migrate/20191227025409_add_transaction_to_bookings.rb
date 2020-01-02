class AddTransactionToBookings < ActiveRecord::Migration[6.0]
  def change
    add_reference :bookings, :transaction, null: false, foreign_key: true
  end
end
