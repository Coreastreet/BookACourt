class AddBookingTypeToTransactions < ActiveRecord::Migration[6.0]
  def change
    add_column :transactions, :bookingType, :integer
  end
end
