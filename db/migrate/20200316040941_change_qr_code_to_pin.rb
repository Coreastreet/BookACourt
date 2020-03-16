class ChangeQrCodeToPin < ActiveRecord::Migration[6.0]
  def change
    remove_column :bookings, :qr_code, :bigInt
  end
end
