module Spree
  module Admin
    class WhatYouNeedsController < ResourceController

      def model_class
        Dish::Whatneed
      end

      def show
        redirect_to action: :edit
      end

      def load_data
      end

      def location_after_save
        admin_what_you_needs_url
      end
    end
  end
end