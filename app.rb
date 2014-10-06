require 'sinatra'
require 'sinatra/base'
require 'rss'
require 'json'
require 'instagram'
require './insta.rb'

class Blog < Sinatra::Base; end

class Blog
  enable :sessions

  get "/" do
    erb :index
  end

  get "/blog" do
    erb :index
  end

  get "/projects" do
    erb :not_found
  end

  get "/about" do
    erb :intro
  end

  get "/rss", :provides => ['rss', 'atom', 'xml'] do
    rss = RSS::Maker.make("2.0") do |maker|
      maker.channel.language = "en"
      maker.channel.author = "Matt Long"
      maker.channel.updated = Time.new(2014, 9, 22)
      maker.channel.link = "http://lankstrosity.us/new.rss"
      maker.channel.title = ""
      maker.channel.description = ""
      maker.items.new_item do |item|
        item.link = "http://lankstrosity.us/blog#threads"
        item.title = "Revisiting Ruby's Thread Class"
        item.updated = Time.new(2014, 9, 22).to_s
      end
    end

    rss.to_xml
  end

  get "/:anything" do
    erb :not_found
  end

  get "/statement" do
    redirect Instagram.authorize_url(:redirect_uri => CALLBACK_URL)
  end

  get "/statement/oauth/callback" do

  end
end
