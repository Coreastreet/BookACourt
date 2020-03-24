class Representative < ApplicationRecord
  has_secure_password
  belongs_to :sports_centre, optional: true
  #validates :email, presence: true, uniqueness: true
  has_one :address, dependent: :destroy
  accepts_nested_attributes_for :address
end
