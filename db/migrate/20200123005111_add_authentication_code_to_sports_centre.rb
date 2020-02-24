class AddAuthenticationCodeToSportsCentre < ActiveRecord::Migration[6.0]
  def change
    add_column :sports_centres, :authenticationCode, :string
  end
end
