class SportsCentre < ApplicationRecord
  has_secure_password
  validates :email, presence: true, uniqueness: true

  serialize :prices, Hash
  serialize :opening_hours, Hash
  serialize :peak_hours, Hash
  #serialize :activities, Hash
  after_touch :notify_bookings_changed

  has_one :address, dependent: :destroy
  has_one :representative, dependent: :destroy
  validates_presence_of :address
  accepts_nested_attributes_for :address
  accepts_nested_attributes_for :representative
  has_many :bookings, dependent: :destroy
  has_one_attached :logo

  has_many :contacts, dependent: :destroy
  has_many :payments
  accepts_nested_attributes_for :contacts

  def notify_bookings_changed
     require "json"
     #response.headers['Content-Type'] = 'text/event-stream'
     #logger.info "check id #{id}"
     RestClient.post "https://weball.com.au/pub/#{id}",  {event: "live_update", bookings: bookings.to_json.html_safe}.to_json, {content_type: :json, accept: :json}
  end
end
