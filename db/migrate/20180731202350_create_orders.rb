class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.string :email
      t.string :first_name
	  t.string :last_name
	  t.integer :location_id
	  t.datetime :date_of_purchase
	  t.string :zp_date
	  t.string :zp_time
	  t.text :note_attributes
    end
  end
end
