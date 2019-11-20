class Price < ApplicationRecord
  belongs_to :booking
  belongs_to :facility
end
