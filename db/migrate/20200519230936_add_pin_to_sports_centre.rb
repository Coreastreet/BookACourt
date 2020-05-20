class AddPinToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :pin, :integer, limit: 4
  end
end
