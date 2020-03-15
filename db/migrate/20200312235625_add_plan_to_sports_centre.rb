class AddPlanToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :plan, :string, default: "Basic"
    add_column :sports_centres, :moneyOwed, :decimal, default: 0.00
  end
end
