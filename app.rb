require 'sinatra'
require 'sinatra/base'
require 'rss'
require 'json'
require 'sequel'

class Blog < Sinatra::Base; end

class Blog
  DB = Sequel.connect("sqlite://magic.db")
  get "/" do
    erb :index
  end

  get "/blog" do
    erb :index
  end

  get "/projects" do
    erb :not_found
  end

  get "/projects/magic" do
    erb :magic
  end

  get "/about" do
    erb :intro
  end

  get "/rss", :provides => ['rss', 'atom', 'xml'] do
    rss = RSS::Maker.make("2.0") do |maker|
      maker.channel.language = "en"
      maker.channel.author = "Matt Long"
      maker.channel.updated = Time.new(2014, 9, 8)
      maker.channel.link = "http://lankstrosity.us/new.rss"
      maker.channel.title = "Parsing"
      maker.channel.description = "Parsing a HUGE file"
      maker.items.new_item do |item|
        item.link = "http://lankstrosity.us/blog#parser"
        item.title = "Parsing and its Malcontents"
        item.updated = Time.new(2014, 9, 8).to_s
      end
    end

    rss.to_xml
  end

  get "/:anything" do
    erb :not_found
  end

  post "/projects/magic/profile/create" do

    id = params[:profileName]
    redirect to("/projects/magic/profile?name=#{id}")
  end

  get "/projects/magic/profile" do
    erb :profile
  end

  post "/magic/deck/:cards" do
  end
end