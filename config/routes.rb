Spree::Core::Engine.routes.draw do
  # Add your extension routes here
  namespace :admin do
    resources :dish_types
    resources :day_deliveries

    resources :ingredients do
      resources :ingredientimages
    end

    resources :what_you_needs

    resources :nutritions
  end

end
