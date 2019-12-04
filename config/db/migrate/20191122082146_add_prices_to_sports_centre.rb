class AddPricesToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :prices, :text
  end
end
