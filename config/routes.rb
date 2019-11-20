Rails.application.routes.draw do
  # home page
  root to: 'home#index'

  # browse listings of sports_centers and their courts
  resources :users, only: [:new, :create, :show] do
  end

  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  resources :sports_centres, only: [:new, :create, :index, :show] do
  end

  get 'sports_centres/:id/date/:date_id', to: "sports_centres#show_again", as: 'sports_centre_again'
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
