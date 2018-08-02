APP_URL = 'https://flour-shop-pos.herokuapp.com/'
DEV_URL = 'https://localhost:3000'
CURRENT_URL = Rails.env.production? ? APP_URL : DEV_URL