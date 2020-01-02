class Booking < ApplicationRecord
  belongs_to :sports_centre
  belongs_to :order
  belongs_to :user, optional: true
end
