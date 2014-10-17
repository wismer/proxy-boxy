class Deck < ActiveRecord::Base
  has_many :cards

  def button
    "<button value='#{self.id}' exp='#{self.expansion}'>Show Card Breakdown</button>"
  end

  def graph
    """
    <div id='viz' exp='#{self.expansion}' deck='#{self.id}'>
      <div class='costs'>COSTS</div>
      <div class='types'>TYPES</div>
      <div class='colors'>COLORS</div>
      <div>VIEW</div>
    </div>
    """
  end

  def cards_to_json
    cards = self.cards
    hash = {}

    cards.each { |card| hash[card.multiverseid] = card.card_count }
    JSON.generate(hash)
  end
end
