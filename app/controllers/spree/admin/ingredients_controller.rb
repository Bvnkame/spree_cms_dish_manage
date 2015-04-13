module Spree
  module Admin
    class IngredientsController < ResourceController

      def model_class
        Dish::Ingredient
      end

      def show
        redirect_to action: :edit
      end

      def location_after_save
        edit_admin_ingredient_url(@ingredient)
      end
    end
  end
end