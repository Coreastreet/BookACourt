class Contact < ApplicationRecord
  belongs_to :sports_centre, optional: true
  enum relationship: { 'owner':0, 'executive':1 }
end
