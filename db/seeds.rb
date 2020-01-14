# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

date = Date.today + 5
court_no = 1

sample_booking_data = [
  ["11:00", "11:30", date, court_no],
  ["11:00", "11:30", date, court_no+1],
  ["11:00", "11:30", date, court_no+2],
  ["11:00", "11:30", date, court_no+3],
  ["11:00", "11:30", date, court_no+4],
  ["11:00", "11:30", date, court_no+5]
  #["10:30", "11:30", date+8, court_no+8]
]

sample_booking_data.each do |startTime, endTime, date, court_no|
  Booking.create!(startTime: startTime, endTime: endTime, date: date,
    sports_centre_id: 40, court_no: court_no, courtType: "halfCourt", order_id: 86,
    bookingType: "casual", claimed: false)
end
