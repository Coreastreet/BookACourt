class AddArrayNamesToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :arrayCourtNames, :string, array: true, default: []
  end
end
