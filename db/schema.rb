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

ActiveRecord::Schema.define(version: 2019_11_19_141410) do

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
    t.bigint "sports_centre_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "state"
    t.string "full_address"
    t.index ["sports_centre_id"], name: "index_addresses_on_sports_centre_id"
  end

  create_table "bookings", force: :cascade do |t|
    t.integer "guest_id"
    t.time "startTime"
    t.time "endTime"
    t.date "startDate"
    t.date "endDate"
    t.integer "interval"
    t.integer "users_id"
    t.decimal "cost"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "sports_centre_id", null: false
    t.integer "court_no"
    t.index ["guest_id"], name: "index_bookings_on_guest_id"
    t.index ["sports_centre_id"], name: "index_bookings_on_sports_centre_id"
    t.index ["users_id"], name: "index_bookings_on_users_id"
  end

  create_table "guests", force: :cascade do |t|
    t.string "email_address"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
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
    t.integer "BSB"
    t.integer "account_number"
    t.string "payID"
    t.string "password_digest"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "addresses", "sports_centres"
  add_foreign_key "bookings", "guests"
  add_foreign_key "bookings", "sports_centres"
  add_foreign_key "prices", "bookings"
  add_foreign_key "prices", "sports_centres", column: "sports_centres_id"
end
