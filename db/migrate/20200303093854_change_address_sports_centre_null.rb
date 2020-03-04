class ChangeAddressSportsCentreNull < ActiveRecord::Migration[6.0]
  def change
    change_column_null :addresses, :sports_centre_id, true
  end
end
