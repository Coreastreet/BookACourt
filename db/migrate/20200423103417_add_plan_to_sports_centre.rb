class AddPlanToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :plan, :integer, default: 0
  end
end
