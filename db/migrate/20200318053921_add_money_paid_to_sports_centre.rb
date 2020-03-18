class AddMoneyPaidToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :moneyPaid, :decimal, default: 0.00
  end
end
