class OrderController < ApplicationController

	skip_before_action :verify_authenticity_token
	before_action :set_headers

	def kiosk_order
		# puts Colorize.magenta(params["attributes"].to_hash)

		order = Order.new

	    order.email = params["kiosk_email"]
	    order.first_name = params["kiosk_first_name"]
		order.last_name = params["kiosk_last_name"]
		order.location_id = params["location_id"]
		order.date_of_purchase = params["datetime"]
		order.zp_date = params["zpDate"]
		order.zp_time = params["zpTime"]
		order.note_attributes = params["attributes"].to_hash

		order.save

		for params_line_item in params["line_items"]
			line_item = LineItem.new

      		line_item.variant_id = params_line_item["variant_id"]
      		line_item.quantity = params_line_item["quantity"]
      		line_item.title = params_line_item["title"]
      		line_item.order_id = order.id

          params_line_item_properties = []

          if params_line_item["properties"]
            for property in params_line_item["properties"]
              params_line_item_properties << {
                name: property["name"],
                value: property["value"]
              }
            end
          end

          # puts Colorize.bright(params_line_item_properties)

          line_item.properties = params_line_item_properties
			
			line_item.save
		end

		# if orderShopify.save
		# 	puts Colorize.green('saved order')
		# 	render json: orderShopify
		# else
		# 	puts Colorize.red('error saving order')
		# 	render json: orderShopify.errors
		# end

		render json: order
	end

	private

		def set_headers
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Request-Method'] = '*'
    end

end