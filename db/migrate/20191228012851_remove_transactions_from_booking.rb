class RemoveTransactionsFromBooking < ActiveRecord::Migration[6.0]
  def change
    remove_reference :bookings, :transactions
    add_reference :bookings, :order, foreign_key: true
  end
end
