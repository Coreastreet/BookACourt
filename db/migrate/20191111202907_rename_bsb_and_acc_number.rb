class RenameBsbAndAccNumber < ActiveRecord::Migration[6.0]
  def change
    rename_column :sports_centres, :bsb, :BSB
    rename_column :sports_centres, :acc, :account_number
  end
end
