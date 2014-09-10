require 'sinatra'
require 'sinatra/base'
require 'rss'
class Blog < Sinatra::Base; end

class Blog

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
      maker.channel.updated = Time.new(2014, 9, 8)
      maker.channel.link = "http://lankstrosity.us/rss/new.rss"
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

end