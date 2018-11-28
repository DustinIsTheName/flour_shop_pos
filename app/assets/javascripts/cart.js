ShopifyPOS.ready(function() {
  document.querySelector('#user-actions').style.display = "block";
});

$(document).ready(function() {
  $('.stage-kiosk-order').click(addKioskOrder);
});

////////////////////////////////////////////////////////////////////////////////////

var successCallback = function(message) {
  ShopifyPOS.flashNotice(message);
}

var errorCallback = function(error) {
  ShopifyPOS.flashError(error);
}

////////////////////////////////////////////////////////////////////////////////////

function clearCart() {
  ShopifyPOS.fetchCart({
    success: function (cart) {
      cart.clear()
    },
    error: function (errors) {
      ShopifyPOS.flashError("Oops! Something went wrong.")
      console.error(errors)
    }
  });
}

function addKioskOrder() {
  clearCart();
  removeCustomerFromCart();

  // $('#kiosk-orders h3').text($('#kiosk-orders h3').text() + '!');

  $stageKioskOrder = $(this);
  $stageKioskOrder.addClass('is-loading');

  var order = $(this).data('order');
  var line_items = [];
  $(this).find('li').each(function() {
    line_items.push($(this).data('line-item'));
  });

  var customer = {
    first_name: order.first_name,
    last_name: order.last_name,
    email: order.email,
    note: "Customer from Kiosk"
  };

  ShopifyPOS.fetchCart({
    success: function (cart) {
      cart.setCustomer(customer, {success: function(cart) {
        console.log("Customer added");
      }, error: errorCallback})

      cart.addProperties(order.note_attributes, {
        success: function(cart) {
          console.log("Successfully added properties to cart")
        },
        error: function(errors) {
          console.log("Failed to add properties to cart")
        }
      })

      line_items.forEach(function(line_item, index) {
        cart.addLineItem({variant_id: line_item.variant_id, quantity: line_item.quantity}, {success: function(cart) {
          console.log("Item added to cart");
        }, error: errorCallback});

        var propertiesObject = {};
        line_item.properties.forEach(function(property) {
          propertiesObject[property.name] = property.value;
        });

        cart.addLineItemProperties(index, propertiesObject, {
          success: function(cart) {
            console.log("Successfully added properties to item")
            $('#kiosk-orders').append('<div class="section">'+JSON.stringify(cart)+'</div>');
            // ShopifyPOS.flashNotice(JSON.stringify(cart))
          },
          error: function(errors) {
            console.log("Failed to add properties to item")
            ShopifyPOS.flashError("Failed to add properties to lineitem")
          }
        });
      });

      successCallback("Loaded Order");
      // ShopifyPOS.Modal.close();
    },
    error: function (errors) {
      ShopifyPOS.flashError("Oops! Something went wrong.")
      console.error(errors)
    }
  });
}

function removeCustomerFromCart() {
  ShopifyPOS.fetchCart({
    success: function (cart) {
      cart.removeCustomer({success: function(cart) {
        // successCallback("Customer removed");
      }, error: errorCallback})
    },
    error: function (errors) {
      ShopifyPOS.flashError("Oops! Something went wrong.")
      console.error(errors)
    }
  });
}
