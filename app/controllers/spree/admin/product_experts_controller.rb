module Spree
  module Admin
    class ProductExpertsController < ResourceController
      #belongs_to 'spree/product', :find_by => :slug
      before_action :load_data
      #update.before :set_viewable

      def model_class
        Bm::Expert
      end

      def model_name
        "expert"
      end

      def controller_name
        "expert"
      end

      def show
        #render :json => @imageavatar
        redirect_to :action => :edit
      end

      def update
        @expert.avatar.alt = params[:expert][:avatar_attributes][:alt]
        invoke_callbacks(:update, :before)
        puts "beforeeeeeeeeeeeee ", @expert.avatar.inspect
        puts "params ", expert_params.inspect
        if @expert.update_attributes(expert_params)
          puts "afterrrrrrrrrrrrrr ", @expert.avatar.inspect
          invoke_callbacks(:update, :after)
          flash[:success] = flash_message_for(@expert, :successfully_updated)
          respond_with(@expert) do |format|
            format.html { redirect_to location_after_save }
            format.js   { render :layout => false }
          end
        else
          puts "error ", @expert.errors.inspect
          invoke_callbacks(:update, :fails)
          respond_with(@expert) do |format|
            format.html do
              flash.now[:error] = @expert.errors.full_messages.join(", ")
              render action: 'edit'
            end
            format.js { render layout: false }
          end
        end
      end

      def location_after_save
        admin_product_product_expert_url
      end

      def load_resource
      # if member_action?
      #   @object ||= load_resource_instance

      #   # call authorize! a third time (called twice already in Admin::BaseController)
      #   # this time we pass the actual instance so fine-grained abilities can control
      #   # access to individual records, not just entire models.
      #   authorize! action, @object

      #   instance_variable_set("@#{object_name}", @object)
      # else
      #   @collection ||= collection

      #   # note: we don't call authorize here as the collection method should use
      #   # CanCan's accessible_by method to restrict the actual records returned

      #   instance_variable_set("@#{controller_name}", @collection)
      # end
    end

      def load_data
        @product = Spree::Product.friendly.find(params[:product_id])

        if @product.expert.nil?
          #build new expert
          @expert = @product.build_expert
          #save to get id
          @expert.save

          #get id from expert
          @product.bm_expert_id = @expert.id
          #save product
          @product.save
        end

        @expert = @product.expert


        if !@expert.avatar.present?
          @expert.build_avatar
        # else
        end

        # end
        # # image
        # @avatar = @object.avatars
        # if @object.avatars.nil?
        #   puts "BUILDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD <===="
        #   @avatar = @object.avatars.build
        # end

      end

      def expert_params
        params.require(:expert).permit(:name, :title, :comment, avatar_attributes: [:attachment, :alt, :viewable_id, :id])
      end
    end
  end
end
