module Spree
  module Admin
    class IngredientimagesController < ResourceController
      before_action :load_data

      create.before :set_viewable
      update.before :set_viewable

      def model_class
        Dish::IngredientImage
      end

      def edit
      end

      def new
        @ingredientimage = @ingredient.images.build
        render :layout => false 
      end

      private 
        def location_after_destroy
          admin_ingredient_ingredientimages_url(@ingredient)
        end

        def location_after_save
          admin_ingredient_ingredientimages_url(@ingredient)
        end

        def load_data
          @ingredient = Dish::Ingredient.find(params[:ingredient_id])
        end

        def set_viewable
          @ingredientimage.viewable_type = 'Dish::Ingredient'
          @ingredientimage.viewable_id = params[:ingredientimage][:viewable_id]
        end
    end
  end
end