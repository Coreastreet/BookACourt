class AddEmailToSportsCentres < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :email, :string
  end
end
