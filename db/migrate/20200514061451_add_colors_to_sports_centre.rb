class AddColorsToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :venue_colors, :text, default: { basketball: '#ffce80', badminton: '#99ccff', volleyball: '#bfff80', event: '#e7c7ae' }.to_yaml
  end
end
