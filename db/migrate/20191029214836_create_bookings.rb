class CreateBookings < ActiveRecord::Migration[6.0]
  def change
    create_table :bookings do |t|
      t.references :guest, null: false, foreign_key: true
      t.time :startTime
      t.time :endTime
      t.date :startDate
      t.date :endDate
      t.integer :interval
      t.references :courts, null: false, foreign_key: true
      t.references :users, null: false, foreign_key: true
      t.decimal :cost

      t.timestamps
    end
  end
end
