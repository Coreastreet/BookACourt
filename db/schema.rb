# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_05_21_023828) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "addresses", force: :cascade do |t|
    t.string "street_address"
    t.string "suburb"
    t.integer "postcode"
    t.bigint "sports_centre_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "state"
    t.string "full_address"
    t.bigint "representative_id"
    t.index ["representative_id"], name: "index_addresses_on_representative_id"
    t.index ["sports_centre_id"], name: "index_addresses_on_sports_centre_id"
  end

  create_table "bookings", force: :cascade do |t|
    t.time "startTime"
    t.time "endTime"
    t.date "date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "sports_centre_id", null: false
    t.integer "court_no"
    t.integer "courtType"
    t.bigint "order_id"
    t.integer "bookingType"
    t.boolean "claimed", default: false
    t.string "sportsType"
    t.string "name"
    t.integer "pin"
    t.index ["order_id"], name: "index_bookings_on_order_id"
    t.index ["sports_centre_id"], name: "index_bookings_on_sports_centre_id"
  end

  create_table "contacts", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.bigint "sports_centre_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "isOwner"
    t.boolean "isDirector"
    t.index ["sports_centre_id"], name: "index_contacts_on_sports_centre_id"
  end

  create_table "orders", force: :cascade do |t|
    t.string "email_address"
    t.decimal "totalCost"
    t.date "startDate"
    t.date "endDate"
    t.integer "daysInBetween"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id"
    t.string "fullName"
    t.bigint "transactionRefNo"
    t.string "merchantRef"
    t.string "customerRef"
    t.boolean "adminEntry"
    t.index ["user_id"], name: "index_orders_on_user_id"
  end

  create_table "payments", force: :cascade do |t|
    t.decimal "amountPaid"
    t.bigint "poliId"
    t.string "planType"
    t.integer "numberOfBookingFeesPaid"
    t.bigint "sports_centre_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["sports_centre_id"], name: "index_payments_on_sports_centre_id"
  end

  create_table "prices", force: :cascade do |t|
    t.bigint "booking_id", null: false
    t.bigint "sports_centres_id", null: false
    t.integer "type"
    t.boolean "casual"
    t.integer "purpose"
    t.string "description"
    t.decimal "hourlyCost"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["booking_id"], name: "index_prices_on_booking_id"
    t.index ["sports_centres_id"], name: "index_prices_on_sports_centres_id"
  end

  create_table "representatives", force: :cascade do |t|
    t.string "name"
    t.date "dob"
    t.string "title"
    t.string "email"
    t.string "phone"
    t.string "password_digest"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "sports_centre_id"
    t.boolean "isOwner"
    t.boolean "isDirector"
    t.index ["sports_centre_id"], name: "index_representatives_on_sports_centre_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.string "session_id", null: false
    t.text "data"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["session_id"], name: "index_sessions_on_session_id", unique: true
    t.index ["updated_at"], name: "index_sessions_on_updated_at"
  end

  create_table "sports_centres", force: :cascade do |t|
    t.string "location"
    t.integer "numberOfCourts"
    t.text "description"
    t.integer "phone"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "title"
    t.string "email"
    t.text "opening_hours"
    t.string "password_digest"
    t.text "prices"
    t.text "peak_hours"
    t.bigint "ABN"
    t.string "URL"
    t.integer "attemptedBookings", default: 0
    t.string "merchantCode"
    t.string "authenticationCode"
    t.boolean "confirmed", default: false
    t.string "combinedCode"
    t.decimal "moneyOwed", default: "0.0"
    t.decimal "transactionRate", precision: 10, scale: 4, default: "0.0"
    t.decimal "moneyPaid", default: "0.0"
    t.decimal "yesterdayMoneyOwed", default: "0.0"
    t.date "nextPaymentDue"
    t.integer "plan", default: 0
    t.text "courtsAllowed"
    t.integer "centreType", default: 1
    t.string "arrayCourtNames", default: [], array: true
    t.text "venue_colors"
    t.integer "pin"
    t.boolean "polipayActivated", default: false
    t.date "freeTrialEndDate"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "addresses", "representatives"
  add_foreign_key "addresses", "sports_centres"
  add_foreign_key "bookings", "orders"
  add_foreign_key "bookings", "sports_centres"
  add_foreign_key "contacts", "sports_centres"
  add_foreign_key "orders", "users"
  add_foreign_key "payments", "sports_centres"
  add_foreign_key "prices", "bookings"
  add_foreign_key "prices", "sports_centres", column: "sports_centres_id"
  add_foreign_key "representatives", "sports_centres"
end
