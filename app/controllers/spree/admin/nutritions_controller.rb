module Spree
  module Admin
    class NutritionsController < ResourceController

      def model_class
        Dish::Nutrition
      end

      def show
        redirect_to action: :edit
      end

      def load_data
      end

      def location_after_save
        admin_nutritions_url
      end

    end
  end
end