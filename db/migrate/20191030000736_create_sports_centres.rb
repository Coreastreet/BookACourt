class CreateSportsCentres < ActiveRecord::Migration[6.0]
  def change
    create_table :sports_centres do |t|
      t.string :location
      t.integer :numberOfCourts
      t.text :description
      t.integer :contactPhone

      t.timestamps
    end
  end
end
