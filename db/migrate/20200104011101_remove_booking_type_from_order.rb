class RemoveBookingTypeFromOrder < ActiveRecord::Migration[6.0]
  def change
    remove_column :orders, :bookingType, :integer
  end
end
