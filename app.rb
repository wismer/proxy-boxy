require "sinatra/activerecord"
require "./models/post"
require "./models/deck"
require "./models/card"

class Blog < Sinatra::Base; end

class Blog
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
end
