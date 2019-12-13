class AddAbnToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :ABN, :integer
  end
end
