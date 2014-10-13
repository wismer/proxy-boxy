class CreateDecks < ActiveRecord::Migration
  def change
    create_table :decks do |t|
      t.string :name
      t.string :expansion
      t.float :white
      t.float :red
      t.float :blue
      t.float :black
      t.float :green
      t.float :multi
      t.float :artifact
      t.float :land
      t.integer :card_total
      t.timestamps
    end
  end
end
