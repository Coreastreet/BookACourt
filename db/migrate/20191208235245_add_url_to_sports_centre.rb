class AddUrlToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :URL, :string
  end
end
