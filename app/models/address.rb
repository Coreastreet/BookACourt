class Address < ApplicationRecord
  belongs_to :sports_centre, optional: true
  belongs_to :representative, optional: true
  enum state: { 'NSW':0, 'VIC':1, 'QLD':2, 'ACT':3, 'SA':4, 'WA':5, 'NT':6 }
end
