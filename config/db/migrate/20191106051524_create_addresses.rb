class CreateAddresses < ActiveRecord::Migration[6.0]
  def change
    create_table :addresses do |t|
      t.string :street_address
      t.string :suburb
      t.string :state
      t.integer :postcode
      t.references :sports_centre, null: false, foreign_key: true

      t.timestamps
    end
  end
end
