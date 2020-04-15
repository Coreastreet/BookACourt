class Booking < ApplicationRecord
  belongs_to :sports_centre, touch: true
  belongs_to :order
  belongs_to :user, optional: true
  enum bookingType: { 'casual':0, 'regular':1 }
  enum courtType: { 'halfCourt':1, 'fullCourt':2 }
end
