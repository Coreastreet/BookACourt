class RemovePlanFromSportsCentre < ActiveRecord::Migration[6.0]
  def change
    remove_column :sports_centres, :plan, :string
  end
end
