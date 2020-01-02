class RemoveTransactionFromBooking < ActiveRecord::Migration[6.0]
  def change
    remove_reference :bookings, :transaction, null: false, foreign_key: true
  end
end
