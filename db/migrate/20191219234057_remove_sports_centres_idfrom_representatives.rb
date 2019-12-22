class RemoveSportsCentresIdfromRepresentatives < ActiveRecord::Migration[6.0]
  def change
    remove_reference :representatives, :sports_centres, index: true
  end
end
