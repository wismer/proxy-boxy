class Blog < Sinatra::Base
  CALLBACK_URL = "http://lankstrosity.us/statement/oauth/callback"
  Instagram.configure do |config|
    config.client_id = "0cc064da15d04a8ca494dcde7eeeb551"
    config.client_secret = "f4a79034fb6347e2bd38ce55e0a11ca2"
  end
end
