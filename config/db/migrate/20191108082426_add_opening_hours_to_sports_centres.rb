class AddOpeningHoursToSportsCentres < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :opening_hours, :text
  end
end
