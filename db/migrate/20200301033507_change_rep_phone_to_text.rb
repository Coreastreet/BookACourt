class ChangeRepPhoneToText < ActiveRecord::Migration[6.0]
  def change
    change_column :representatives, :phone, :string
  end
end
