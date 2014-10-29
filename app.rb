require "sinatra/activerecord"
require "instagram"
require "./models/post"
require "./models/deck"
require "./models/card"
require "./insta.rb"


class Blog < Sinatra::Base; end

class Blog
  enable :sessions
  register Sinatra::ActiveRecordExtension

  get "/" do
    erb :index
  end

  get "/blog" do
    @post = Post.all

    erb :blog
  end

  get "/draft-creator" do
    erb :deck_creator
  end

  get "/decks" do
    @decks = Deck.all
    erb :decks
  end

  get "/deck-info/:id" do
    @deck = Deck.find(params[:id])
    @deck.cards_to_json
  end

  post "/decks" do
    data = JSON.parse(request.body.read)
    @deck = Deck.create(data["deck"])
    @deck.cards.create(data['cards'])
  end

  get "/decks/:id" do
    @deck = Deck.find(params[:id])

    erb :deck
  end

  get "/quicksort" do
    erb :deck
  end

  get "/magic-game" do
    @deck = Deck.find(params[:id])
    erb :magic
  end

  get "/user/content/:user_id" do
    client = Instagram.client(:access_token => session[:access_token])
    # client.
  end

  get "/instagram/search/:username" do
    client = Instagram.client(:access_token => session[:access_token])
    client.user_search(params[:username])
  end

  get "/instagram/search" do
    client = Instagram.client(:access_token => session[:access_token])
    erb :insta_search
  end

  get "/statement/oauth/callback" do
    response = Instagram.get_access_token(params[:code], :redirect_uri => CALLBACK_URL)
    session[:access_token] = response.access_token
    redirect "/instagram/search"
  end

  get "/statement" do
    redirect Instagram.authorize_url(:redirect_uri => "http://lankstrosity.us/oauth/callback")
  end
end
