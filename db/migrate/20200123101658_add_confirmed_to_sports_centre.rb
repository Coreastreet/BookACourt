class AddConfirmedToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :confirmed, :boolean
  end
end
