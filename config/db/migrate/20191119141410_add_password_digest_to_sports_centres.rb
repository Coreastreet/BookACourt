class AddPasswordDigestToSportsCentres < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :password_digest, :string
  end
end
