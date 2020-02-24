class AddDefaultFalseToConfirmed < ActiveRecord::Migration[6.0]
  def change
    change_column :sports_centres, :confirmed, :boolean, default: false
  end
end
