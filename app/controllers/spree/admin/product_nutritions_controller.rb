module Spree
  module Admin
    class ProductNutritionsController < ResourceController
      belongs_to 'spree/product', :find_by => :slug
      before_action :find_nutritions

      def model_class
        Dish::ProductNutrition
      end

      def location_after_save
        admin_product_product_nutritions_url
      end

      def default_unit(unit)
        if unit.presence?
          @unit[:unit]
        else
          @unit.first
        end
      end

      private
        def find_nutritions
          @nutritions = Dish::Nutrition.pluck(:name)
          @units = [:mg, :g, :kcal, :IU, :ml, :ug]
        end
    end
  end
end
