class AddTitleToSportsCentres < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :title, :string
  end
end
