class CreatePrices < ActiveRecord::Migration[6.0]
  def change
    create_table :prices do |t|
      t.references :booking, null: false, foreign_key: true
      t.references :sports_centres, null: false, foreign_key: true
      t.integer :type
      t.boolean :casual
      t.integer :purpose
      t.string :description
      t.decimal :hourlyCost

      t.timestamps
    end
  end
end
