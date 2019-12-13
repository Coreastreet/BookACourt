class SportsCentre < ApplicationRecord
  has_secure_password
  validates :email, presence: true, uniqueness: true

  serialize :prices, Hash
  serialize :opening_hours, Hash
  serialize :peak_hours, Hash

  has_one :address, dependent: :destroy
  has_one :representative, dependent: :destroy
  validates_presence_of :address
  accepts_nested_attributes_for :address
  accepts_nested_attributes_for :representative
  has_many :bookings, dependent: :destroy
  has_many_attached :images

  has_many :contacts, dependent: :destroy
  accepts_nested_attributes_for :contacts
end
