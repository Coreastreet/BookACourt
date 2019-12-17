class ChangeContacts < ActiveRecord::Migration[6.0]
  def change
    change_column_null :contacts, :sports_centre_id, true
  end
end
