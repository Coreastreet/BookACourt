class AddCombinedCodeToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :combinedCode, :string
  end
end
