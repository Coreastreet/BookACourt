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

  resources :sports_centres, only: [:new, :create, :index, :update] do
  end

  # move to new admin controller later
  get "/sports_centres/:id", to: "sports_centres#user_show", as: "sports_centre_user"

  get "/sports_centres/:sports_centre_id/booking_success", to: "sports_centres#booking_success", as: "sports_centre_booking_success"
  get "/sports_centres/booking_failure", to: "sports_centres#booking_failure", as: "sports_centre_booking_failure"
  get "/sports_centres/booking_cancelled", to: "sports_centres#booking_cancelled", as: "sports_centre_booking_cancelled"
  # above route overlaps with the one below, should try to simplify routes later on
  get "/sports_centres/:id/:date", to: "sports_centres#user_show", as: "sports_centre_user_date"

  # after a transaction successfully completes


  scope :admin, as: 'admin' do
    resources :sports_centres, only: [:show] do
    end
  end

  get "admin/sports_centre/:id/newPeakHour", to: "admin#newPeakHour", as: "new_peak_hour"

  get 'admin/sports_centres/:id/date/:date_id', to: "admin#show_again", as: 'admin_show_again'

  post "admin/sports_centres/:id/peak_hours", to: "admin#updatePeakHours", as: "admin_update_peak"

  # api versioning
  namespace :api do
    namespace :v1, defaults: {format: 'json'} do
        resources :sports_centres, only: [:show] do
          resource :bookings, shallow: true, only: [:create] do
            post "initiate", on: :collection
            post "claim_booking", on: :collection
          end
        end
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
