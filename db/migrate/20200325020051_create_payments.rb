class CreatePayments < ActiveRecord::Migration[6.0]
  def change
    create_table :payments do |t|
      t.decimal :amountPaid
      t.bigint :poliId
      t.string :planType
      t.integer :numberOfBookingFeesPaid
      t.references :sports_centre, null: false, foreign_key: true
      t.string :status

      t.timestamps
    end
  end
end
