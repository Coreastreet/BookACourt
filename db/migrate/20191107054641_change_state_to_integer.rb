class ChangeStateToInteger < ActiveRecord::Migration[6.0]
  def change
    remove_column :addresses, :state
  end
end
