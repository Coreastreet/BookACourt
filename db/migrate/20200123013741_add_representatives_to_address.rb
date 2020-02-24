class AddRepresentativesToAddress < ActiveRecord::Migration[6.0]
  def change
    add_reference :addresses, :representative, null: true, foreign_key: true
  end
end
