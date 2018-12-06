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

  def pos_order
    # puts Colorize.magenta(params)

    # ShopifyAPI::Base.site = "https://#{ENV['PRIVATE_API_KEY']}:#{ENV['PRIVATE_SECRET']}@flour-shop.myshopify.com/admin"
    session = ShopifyAPI::Session.new("flour-shop.myshopify.com", Shop.first.shopify_token)
    ShopifyAPI::Base.activate_session(session)

    is_pos_kiosk = false
    for attribute in params["note_attributes"]
      if attribute["name"] == 'pos-kiosk-orders'
        is_pos_kiosk = true
        internal_order_id = attribute["value"]
      end
    end

    if is_pos_kiosk
      order = Order.find_by_id(internal_order_id)
      puts "is_pos_kiosk"
      if order
        puts "order"
        puts @shop_session
        shopify_order = ShopifyAPI::Order.find(params["id"])

        new_cart_note = ''
        for item in order.line_items
          new_cart_note += item.title + "\n\n"
          for property in item.properties
            new_cart_note += "#{property[:name]}: #{property[:value]}\n"
          end
        end

        shopify_order.note = new_cart_note
        puts new_cart_note
        if shopify_order.save
          puts "saved order"
        else
          puts shopify_order.errors.messages

        end
      end
    end

    head :ok
  end

	private

		def set_headers
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Request-Method'] = '*'
    end

end