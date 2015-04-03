module Spree
  module Admin
    class DayDeliveriesController < ResourceController

      def model_class
        Dish::DateDelivery
      end
      

    end
  end
end