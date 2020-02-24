class AddMerchantCodeToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :merchantCode, :string
  end
end
