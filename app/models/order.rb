class Order < ApplicationRecord
  belongs_to :user, optional: true
  enum bookingType: { 'casual':0, 'regular':1 }
  has_many :bookings
end
