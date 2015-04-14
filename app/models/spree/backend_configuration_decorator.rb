module Spree
  
  BackendConfiguration.const_set( :PRODUCT_TABS, [ :products, :dish_types, :day_deliveries, :ingredients, 
                                                   :what_you_needs, :nutritions, :product_nutritions, :images, :expert, :ingredientimages])
  BackendConfiguration.class_eval do
    
  end
  
end