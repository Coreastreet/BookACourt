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
     ActiveRecord::Base.connection_pool.with_connection do |connection|
       execute_query(connection, ["NOTIFY sports_centre_?, ?", id, id.to_s])
     end
  end

  def on_bookings_change
    Thread.new do
      ActiveRecord::Base.connection_pool.with_connection do |connection|
        begin
          execute_query(connection, ["LISTEN sports_centre_?", id])
          connection.raw_connection.wait_for_notify do |event, pid, status|
            yield status
          end
        ensure
          execute_query(connection, ["UNLISTEN sports_centre_?", id])
          ActiveRecord::Base.connection_pool.release_connection
        end
      end
    end
  end

  def self.clean_sql(query)
    sanitize_sql(query)
  end

  private

  def execute_query(connection, query)
    sql = self.class.clean_sql(query)
    connection.execute(sql)
  end
end
