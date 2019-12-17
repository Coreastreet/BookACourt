class ChangeRepresentatives < ActiveRecord::Migration[6.0]
  def change
    change_column_null :representatives, :sports_centres_id, true
  end
end
