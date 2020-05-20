class ChangeCentreTypeToVenue < ActiveRecord::Migration[6.0]
  def change
    change_column_default :sports_centres, :centreType, from: 0, to: 1
  end
end
