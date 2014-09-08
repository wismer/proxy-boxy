require 'sinatra'
require 'sinatra/base'

class Blog < Sinatra::Base; end

class Blog
  get "/" do
    erb :index
  end
end