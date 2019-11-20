class CrenameContactPhoneToPhone < ActiveRecord::Migration[6.0]
  def change
    rename_column :sports_centres, :contactPhone, :phone 
  end
end
