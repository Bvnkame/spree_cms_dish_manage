module Spree
  module Admin
    class ProductsController < ResourceController
      helper 'spree/products'

      before_action :load_data, except: :index
      # create.before :create_before
      # update.before :update_before
      helper_method :clone_object_url

      def show
        session[:return_to] ||= request.referer
        redirect_to action: :edit
      end

      def index
        session[:return_to] = request.url
        respond_with(@collection)
      end

      def update
        if params[:product][:ingredient_ids].present?
          params[:product][:ingredient_ids] = params[:product][:ingredient_ids].split(',')
        end

        if params[:product][:whatneed_ids].present?
          params[:product][:whatneed_ids] = params[:product][:whatneed_ids].split(',')
        end

        if params[:product][:nutrition_ids].present?
          params[:product][:nutrition_ids] = params[:product][:nutrition_ids].split(',')
        end
        invoke_callbacks(:update, :before)
        if @object.update_attributes(permitted_resource_params)
          invoke_callbacks(:update, :after)
          flash[:success] = flash_message_for(@object, :successfully_updated)
          respond_with(@object) do |format|
            format.html { redirect_to location_after_save }
            format.js   { render layout: false }
          end
        else
          # Stops people submitting blank slugs, causing errors when they try to
          # update the product again
          @product.slug = @product.slug_was if @product.slug.blank?
          invoke_callbacks(:update, :fails)
          respond_with(@object)
        end
      end

      def destroy
        @product = Product.friendly.find(params[:id])
        @product.destroy

        flash[:success] = Spree.t('notice_messages.product_deleted')

        respond_with(@product) do |format|
          format.html { redirect_to collection_url }
          format.js  { render_js_for_destroy }
        end
      end

      def clone
        @new = @product.duplicate

        if @new.save
          flash[:success] = Spree.t('notice_messages.product_cloned')
        else
          flash[:error] = Spree.t('notice_messages.product_not_cloned')
        end

        redirect_to edit_admin_product_url(@new)
      end

      # def product_expert
      #   if !@product.expert
      #     @expert = model_class.new
      #   else 
      #     @expert = @product.expert
      #  end

      #   render :json => @expert
      # end

      protected

      def find_resource
        Product.with_deleted.friendly.find(params[:id])
      end

      def location_after_save
        spree.edit_admin_product_url(@product)
      end

      def load_data
        #@ingredients = Dish::Ingredient.order(:name)
        #@whatneeds = Dish::Whatneed.order(:name)
        #@nutritions = Dish::Nutrition.order(:name)
        #@shipping_categories = ShippingCategory.order(:name)
        @dish_types = Dish::DishType.order(:name)
        @difficulties = Dish::Difficulty.all
      end

      # def get_ingredients
      #   return if option_values_hash.nil?
      #   option_values_hash.keys.map(&:to_i).each do |id|
      #     self.option_type_ids << id unless option_type_ids.include?(id)
      #     product_option_types.create(option_type_id: id) unless product_option_types.pluck(:option_type_id).include?(id)
      #   end
      # end

      def collection
        return @collection if @collection.present?
        params[:q] ||= {}
        params[:q][:deleted_at_null] ||= "1"
        
        params[:q][:s] ||= "name asc"
        @collection = super
        if params[:q].delete(:deleted_at_null) == '0'
          @collection = @collection.with_deleted
        end
        # @search needs to be defined as this is passed to search_form_for
        @search = @collection.ransack(params[:q])
        @collection = @search.result.
              distinct_by_product_ids(params[:q][:s]).
              #includes(product_includes).
              page(params[:page]).
              per(params[:per_page] || Spree::Config[:admin_products_per_page])

        @collection
      end

      # def create_before
      #   return if params[:product][:prototype_id].blank?
      #   @prototype = Spree::Prototype.find(params[:product][:prototype_id])
      # end

      # def update_before
      #   # note: we only reset the product properties if we're receiving a post
      #   #       from the form on that tab
      #   return unless params[:clear_product_properties]
      #   params[:product] ||= {}
      # end

      # def product_includes
      #   [{ variants: [:images], master: [:images, :default_price] }]
      # end

      def clone_object_url(resource)
        clone_admin_product_url resource
      end

      private

      # def variant_stock_includes
      #   [:images, stock_items: :stock_location, option_values: :option_type]
      # end
    end
  end
end
