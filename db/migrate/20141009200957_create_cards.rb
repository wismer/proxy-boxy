class CreateCards < ActiveRecord::Migration
  def change
    create_table :cards do |t|
      t.integer :multiverseid
      t.integer :card_count
      t.references :deck, :index => true
    end
  end
end
