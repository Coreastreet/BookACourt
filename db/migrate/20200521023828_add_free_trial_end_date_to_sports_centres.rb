class AddFreeTrialEndDateToSportsCentres < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :freeTrialEndDate, :date
  end
end
