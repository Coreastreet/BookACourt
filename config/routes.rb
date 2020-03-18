Rails.application.routes.draw do
  get 'admin/createPeakHours'
  get 'admin/editPeakHours'
  # home page
  root to: 'home#index'

  # browse listings of sports_centers and their courts
  resources :users, only: [:new, :create, :show] do
  end

  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  resources :sports_centres, only: [:new, :create, :index] do
  end

  get "/sports_centres/:id/check_availability", to: "sports_centres#check_availability", as: "sports_centre_check_availability"
  # move to new admin controller later
  get "/sports_centres/:id/user_show", to: "sports_centres#user_show", as: "sports_centre_user"

  get "/sports_centres/:sports_centre_id/booking_success", to: "sports_centres#booking_success", as: "sports_centre_booking_success"
  get "/sports_centres/booking_failure", to: "sports_centres#booking_failure", as: "sports_centre_booking_failure"
  get "/sports_centres/booking_cancelled", to: "sports_centres#booking_cancelled", as: "sports_centre_booking_cancelled"
  # above route overlaps with the one below, should try to simplify routes later on
  get "/sports_centres/:id/:date", to: "sports_centres#user_show", as: "sports_centre_user_date"

  # after a transaction successfully completes


  #scope :admin, as: 'admin' do
  #  resources :sports_centres, only: [:show] do
  #  end
  #end

  get "admin/sports_centre/:id", to: "admin#show", as: "admin_sports_centre"

  get "admin/sports_centre/:id/newPeakHour", to: "admin#newPeakHour", as: "new_peak_hour"

  get 'admin/sports_centre/:id/date', to: "admin#show_again", as: 'admin_show_again'
  get 'admin/sports_centre/:id/payMoneyOwed', to: "admin#payMoneyOwed", as: 'admin_pay_money_owed'

  post "admin/sports_centre/:id/addNewBookings", to: "admin#addNewBookings", as: "admin_add_new_bookings"
  post "admin/sports_centre/:id/deleteBooking", to: "admin#deleteBooking", as: "admin_delete_booking"
  post "admin/sports_centre/:id/deleteOrder", to: "admin#deleteOrder", as: "admin_delete_order"

  post "admin/sports_centres/:id/peak_hours", to: "admin#updatePeakHours", as: "admin_update_peak"

  post "admin/sports_centres/:id/update_logo", to: "admin#update_logo", as: "admin_update_logo"
  post "admin/sports_centres/:id/update_hours", to: "admin#update_hours", as: "admin_update_hours"
  post "admin/sports_centres/:id/update_prices", to: "admin#update_prices", as: "admin_update_prices"
  post "admin/sports_centres/:id/update_plan", to: "admin#update_plan", as: "admin_update_plan"

  post "admin/sports_centres/:id/check_pin", to: "admin#check_pin", as: "admin_check_pin"
  # api versioning
  namespace :api do
    namespace :v1, defaults: {format: 'json'} do
        resources :sports_centres, only: [:show] do
          get "confirm_email", on: :member
          resource :bookings, shallow: true, only: [:create] do
            post "initiate", on: :collection
            post "claim_booking", on: :collection
            get "check_availability", on: :collection
            post "check_qrCode", on: :collection
          end
        end
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
