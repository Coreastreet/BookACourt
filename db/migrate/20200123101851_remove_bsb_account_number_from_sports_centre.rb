class RemoveBsbAccountNumberFromSportsCentre < ActiveRecord::Migration[6.0]
  def change
    remove_column :sports_centres, :BSB, :integer
    remove_column :sports_centres, :account_number, :integer
  end
end
