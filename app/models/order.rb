class Order < ApplicationRecord
  belongs_to :user, optional: true
  has_many :bookings, dependent: :destroy
end
