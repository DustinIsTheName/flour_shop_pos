class Order < ActiveRecord::Base
  has_many :line_items
  serialize :note_attributes, Hash
end