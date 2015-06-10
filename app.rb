require 'sinatra/activerecord'
require 'twitter'
require './models/post'
require './models/deck'
require './models/card'
require './insta.rb'


module ShieldsUp
  class Server < Sinatra::Base; end

  class Server
    enable :sessions
    register Sinatra::ActiveRecordExtension

    get "/" do
      erb :index
    end
  end
end
