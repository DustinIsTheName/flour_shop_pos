class LineItem < ActiveRecord::Base
  belongs_to :order
  serialize :properties, Array
end