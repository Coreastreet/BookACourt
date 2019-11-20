class Booking < ApplicationRecord
  belongs_to :guest, optional: true
  belongs_to :sports_centre
  belongs_to :user, optional: true
end
