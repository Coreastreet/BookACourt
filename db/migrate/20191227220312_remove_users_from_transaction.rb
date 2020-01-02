class RemoveUsersFromTransaction < ActiveRecord::Migration[6.0]
  def change
     remove_reference :transactions, :users, foreign_key: true
  end
end
