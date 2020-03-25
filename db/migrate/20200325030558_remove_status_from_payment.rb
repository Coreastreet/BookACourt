class RemoveStatusFromPayment < ActiveRecord::Migration[6.0]
  def change
    remove_column :payments, :status, :string
  end
end
