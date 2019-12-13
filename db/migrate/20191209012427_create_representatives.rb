class CreateRepresentatives < ActiveRecord::Migration[6.0]
  def change
    create_table :representatives do |t|
      t.string :name
      t.date :dob
      t.string :title
      t.string :email
      t.integer :phone
      t.string :password_digest
      t.references :sports_centres, null: false, foreign_key: true

      t.timestamps
    end
  end
end
