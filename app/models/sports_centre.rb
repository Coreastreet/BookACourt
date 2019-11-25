class SportsCentre < ApplicationRecord
  has_secure_password
  validates :email, presence: true, uniqueness: true

  serialize :prices, Hash
  serialize :opening_hours, Hash

  has_one :address, dependent: :destroy
  validates_presence_of :address
  accepts_nested_attributes_for :address
  has_many :bookings, dependent: :destroy
  has_many_attached :images
end
