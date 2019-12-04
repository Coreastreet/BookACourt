class AddPeakHoursToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :peak_hours, :text
  end
end
