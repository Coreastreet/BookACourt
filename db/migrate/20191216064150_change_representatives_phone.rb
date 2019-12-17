class ChangeRepresentativesPhone < ActiveRecord::Migration[6.0]
  def change
    change_column :representatives, :phone, :bigint
  end
end
