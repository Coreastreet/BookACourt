class RenameGuestToTransaction < ActiveRecord::Migration[6.0]
  def change
    rename_table :guests, :transactions
  end
end
