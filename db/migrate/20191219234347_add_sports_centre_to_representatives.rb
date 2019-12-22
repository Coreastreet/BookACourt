class AddSportsCentreToRepresentatives < ActiveRecord::Migration[6.0]
  def change
    add_reference :representatives, :sports_centre, null: true, foreign_key: true
  end
end
