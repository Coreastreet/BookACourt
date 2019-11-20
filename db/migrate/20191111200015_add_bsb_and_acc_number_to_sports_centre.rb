class AddBsbAndAccNumberToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :bsb, :integer
    add_column :sports_centres, :acc, :integer
    add_column :sports_centres, :payID, :string
  end
end
