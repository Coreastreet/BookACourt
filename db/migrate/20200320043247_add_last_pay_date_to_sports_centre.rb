class AddLastPayDateToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :lastPayDate, :date
  end
end
