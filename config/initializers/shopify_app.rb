ShopifyApp.configure do |config|
  config.api_key = ENV['API_KEY']
  config.secret = ENV['SECRET']
  # config.redirect_uri = "#{APP_URL}/auth/shopify/callback"
  config.scope = "read_orders, read_products"
  config.embedded_app = true
end
