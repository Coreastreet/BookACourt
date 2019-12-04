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

  # move to new admin controller later
  get "/sports_centres/:id", to: "sports_centres#user_show", as: "sports_centre_user"
  get "/sports_centres/:id/:date", to: "sports_centres#user_show", as: "sports_centre_user_date"

  scope :admin, as: 'admin' do
    resources :sports_centres, only: [:show] do
    end
  end

  get "admin/sports_centre/:id/newPeakHour", to: "admin#newPeakHour", as: "new_peak_hour"

  get 'admin/sports_centres/:id/date/:date_id', to: "admin#show_again", as: 'admin_show_again'

  post "admin/sports_centres/:id/peak_hours", to: "admin#updatePeakHours", as: "admin_update_peak"
  # get 'home/index'
  # get 'home/about'
  # get 'courts/create'
  # get 'courts/delete'
  # get 'courts/index'
  # get 'sports_centres/create'
  # get 'sports_centres/delete'
  # get 'sports_centres/index'
  # get 'sports_centres/read'
  # get 'sports_centres/edit'
  # get 'prices/index'
  # get 'prices/create'
  # get 'prices/delete'
  # get 'prices/edit'
  # get 'bookings/create'
  # get 'bookings/read'
  # get 'bookings/calculateRate'
  # get 'guests/create'
  # get 'guests/delete'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
