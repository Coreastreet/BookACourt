class SportsCentreAbNtoBigInt < ActiveRecord::Migration[6.0]
  def change
    change_column :sports_centres, :ABN, :bigInt
  end
end
