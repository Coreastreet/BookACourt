class CreateTransactions < ActiveRecord::Migration[6.0]
  def change
    create_table :transactions do |t|
      t.string :email_address
      t.integer :bookingType
      t.decimal :totalCost
      t.date :startDate
      t.date :endDate
      t.integer :daysInBetween
      t.references :users, null: true, foreign_key: true

      t.timestamps
    end
  end
end
