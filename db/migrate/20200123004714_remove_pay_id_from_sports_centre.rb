class RemovePayIdFromSportsCentre < ActiveRecord::Migration[6.0]
  def change
    remove_column :sports_centres, :payID, :string
  end
end
