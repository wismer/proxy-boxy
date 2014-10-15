class Deck < ActiveRecord::Base
  has_many :cards

  def button
    "<button value='#{self.id}' exp='#{self.expansion}'>Show Card Breakdown</button>"
  end

  def cards_to_json
    cards = self.cards
    hash = {}

    cards.each { |card| hash[card.multiverseid] = card.card_count }
    JSON.generate(hash)
  end
end
