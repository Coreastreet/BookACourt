class AddCentreTypeToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :centreType, :integer, default: 0
  end
end
