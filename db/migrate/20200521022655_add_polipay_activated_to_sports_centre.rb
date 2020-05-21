class AddPolipayActivatedToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :polipayActivated, :boolean, default: false
  end
end
