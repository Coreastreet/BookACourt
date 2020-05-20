class RenameLastPayDateToNextPaymentDue < ActiveRecord::Migration[6.0]
  def change
    rename_column :sports_centres, :lastPayDate, :nextPaymentDue
  end
end
