shopify_app_config = Rails.application.config_for(:shopify_app)

ShopifyApp.configure do |config|
  config.application_name = "My Shopify App"
  config.api_key = ENV['API_KEY']
  config.secret = ENV['SECRET']
  config.scope = "write_orders, read_products"
  config.embedded_app = true
  config.after_authenticate_job = false
  config.session_repository = ShopifyApp::InMemorySessionStore
end
