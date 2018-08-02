class CreateLineItems < ActiveRecord::Migration
  def change
    create_table :line_items do |t|
      t.integer :variant_id, limit: 8
      t.integer :quantity
      t.text :properties
      t.integer :order_id
    end
  end
end
