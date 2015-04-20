module Spree
  module Admin
    class DayDeliveriesController < ResourceController

      # before_action :weektime
      # helper_method :week_format
      # helper_method :day_start
      # helper_method :day_end
      # helper_method :time_format
      helper_method :today

      def model_class
        Dish::DateDelivery
      end

      def today
        Time.now.strftime("%Y-%m-%d")
      end
      
      # def weektime

      #   now = Time.now
      #   deltaDay = 0

      #   week = params[:week]
      #   case week
      #   when -1
      #     deltaDay = -2
      #   when 0
      #     deltaDay = 1
      #   when 1
      #     deltaDay = 2
      #   else
      #   end

      #   @firstDay = now - (now.strftime("%w").to_i * deltaDay - 1) * 24 * 3600;

      #   @lastDay = @firstDay + 5 * 24 * 3600;
      # end

      # def day_start
      #   @firstDay.strftime("%Y-%m-%d")
      # end

      # def day_end
      #   @lastDay.strftime("%Y-%m-%d")
      # end

      # def week_format
      #   @firstDay.strftime("%Y-%m-%d") + " => " + @lastDay.strftime("%Y-%m-%d")
      # end

      # def time_format (time)
      #   time.strftime("%Y-%m-%d")
      # end

    end
  end
end