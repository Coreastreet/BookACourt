class AddColorsToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :venue_colors, :text
  end
end
