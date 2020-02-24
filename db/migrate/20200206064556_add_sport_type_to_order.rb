class AddSportTypeToOrder < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :sportsType, :string
  end
end
