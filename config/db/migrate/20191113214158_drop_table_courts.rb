class DropTableCourts < ActiveRecord::Migration[6.0]
  def change
    drop_table :courts, force: :cascade
  end
end
