ShopifyPOS.ready(function() {
  document.querySelector('#user-actions').style.display = "block";
});

$('.stage-kiosk-order').click(addKioskOrder);

////////////////////////////////////////////////////////////////////////////////////

// function randomItem(arr) {
//   return arr[Math.round(Math.random() * (arr.length - 1))];
// }

// function getRandomFromCart(cart) {
//   return (cart.line_items.length == 1) ? 0 : Math.round(Math.random() * (cart.line_items.length-1));
// }

var successCallback = function(message) {
  ShopifyPOS.flashNotice(message);
}

// var cartCallback = function(cart) {
//   ShopifyPOS.flashNotice(JSON.stringify(cart))
// }

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

      line_items.forEach(function(line_item) {
        cart.addLineItem({variant_id: line_item.variant_id, quantity: line_item.quantity}, {success: function(cart) {
          console.log("Item added to cart");
        }, error: errorCallback});
      });

      successCallback("Loaded Order");
      ShopifyPOS.Modal.close();
    },
    error: function (errors) {
      ShopifyPOS.flashError("Oops! Something went wrong.")
      console.error(errors)
    }
  });
}

// function addRandomItem() {
//   var productId = randomItem(productIds);
//   var variants = products[productId];
//   var variantId = randomItem(variants);

//   ShopifyPOS.fetchCart({
//     success: function (cart) {
//       cart.addLineItem({variant_id: variantId}, {success: function(cart) {
//         successCallback("Item added to cart");
//       }, error: errorCallback});
//     },
//     error: function (errors) {
//       ShopifyPOS.flashError("Oops! Something went wrong.")
//       console.error(errors)
//     }
//   });
// }

// function removeRandomItem() {
//   ShopifyPOS.fetchCart({
//     success: function (cart) {
//       var randomIndex = getRandomFromCart(cart);
//       cart.removeLineItem(randomIndex, {success: function(cart) {
//         successCallback("Item removed from cart");
//       }, error: errorCallback});
//     },
//     error: function (errors) {
//       ShopifyPOS.flashError("Oops! Something went wrong.")
//       console.error(errors)
//     }
//   });
// }

// function updateRandomItem() {
//   ShopifyPOS.fetchCart({
//     success: function (cart) {
//       var randomIndex = getRandomFromCart(cart);
//       var randomLineItem = cart.line_items[randomIndex];
//       var newQty = randomLineItem.quantity + 1;

//       cart.updateLineItem(randomIndex, {quantity: newQty}, {success: function(cart) {
//         successCallback("Line item updated");
//       }, error: errorCallback});
//     },
//     error: function (errors) {
//       ShopifyPOS.flashError("Oops! Something went wrong.")
//       console.error(errors)
//     }
//   });
// }

// function addCustomerToCart() {
//   firstNames = ["Mary", "James", "John", "Sarah", "Frank", "Billie", "Amy"];
//   lastNames = ["Pond", "Slater", "Morris", "Daly", "Young", "Adams", "Simpson"];

//   firstName = randomItem(firstNames);
//   lastName = randomItem(lastNames);

//   customer = {
//     first_name: firstName,
//     last_name: lastName,
//     email: [firstName, lastName].join(".") + "@email.com",
//     note: "Custom customer from embedded app"
//   };

//   ShopifyPOS.fetchCart({
//     success: function (cart) {
//       cart.setCustomer(customer, {success: function(cart) {
//         successCallback("Customer added");
//       }, error: errorCallback})
//     },
//     error: function (errors) {
//       ShopifyPOS.flashError("Oops! Something went wrong.")
//       console.error(errors)
//     }
//   });
// }

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

// function createDiscount() {
//   var amount = $('#discount-amount').val();
//   var discountDescription = $('#discount-description').val();

//   discount = {
//     amount: amount,
//     discount_description: discountDescription,
//     type: "flat"
//   }

//   return discount;
// }

// function addDiscountToLineItem() {
//   ShopifyPOS.fetchCart({
//     success: function (cart) {
//       cart.setLineItemDiscount(0, createDiscount(), {success: function(cart) {
//         successCallback("Line item discounted");
//       }, error: errorCallback})
//     },
//     error: function (errors) {
//       ShopifyPOS.flashError("Oops! Something went wrong.")
//       console.error(errors)
//     }
//   });
// }

// function removeDiscountFromLineItem() {
//   ShopifyPOS.fetchCart({
//     success: function (cart) {
//       cart.removeLineItemDiscount(0, {success: function(cart) {
//         successCallback("Line item discount removed");
//       }, error: errorCallback})
//     },
//     error: function (errors) {
//       ShopifyPOS.flashError("Oops! Something went wrong.")
//       console.error(errors)
//     }
//   });
// }

// function addDiscountToCart() {
//   ShopifyPOS.fetchCart({
//     success: function (cart) {
//       cart.setDiscount(createDiscount(), {success: function(cart) {
//         successCallback("Cart discounted");
//       }, error: errorCallback})
//     },
//     error: function (errors) {
//       ShopifyPOS.flashError("Oops! Something went wrong.")
//       console.error(errors)
//     }
//   });
// }

// function removeDiscountFromCart() {
//   ShopifyPOS.fetchCart({
//     success: function (cart) {
//       cart.removeDiscount({success: function(cart) {
//         successCallback("Cart discount removed");
//       }, error: errorCallback})
//     },
//     error: function (errors) {
//       ShopifyPOS.flashError("Oops! Something went wrong.")
//       console.error(errors)
//     }
//   });
// }

// function createProperty() {
//   var name = $('#property-name').val();
//   var value = $('#property-value').val();

//   property = {};
//   property[name] = value;

//   return property;
// }

// function addPropertyToLineItem() {
//   ShopifyPOS.fetchCart({
//     success: function (cart) {
//       cart.addLineItemProperties(0, createProperty(), {success: function(cart) {
//         successCallback("Line item property added");
//       }, error: errorCallback})
//     },
//     error: function (errors) {
//       ShopifyPOS.flashError("Oops! Something went wrong.")
//       console.error(errors)
//     }
//   });
// }

// function removePropertyFromLineItem() {
//   var propertyName = $('#prop-to-remove').val();

//   ShopifyPOS.fetchCart({
//     success: function (cart) {
//       cart.removeLineItemProperties(0, [propertyName], {success: function(cart) {
//         successCallback("Line item property removed");
//       }, error: errorCallback})
//     },
//     error: function (errors) {
//       ShopifyPOS.flashError("Oops! Something went wrong.")
//       console.error(errors)
//     }
//   });
// }

// function addPropertyToCart() {
//   ShopifyPOS.fetchCart({
//     success: function (cart) {
//       cart.addProperties(createProperty(), {success: function(cart) {
//         successCallback("Cart property added");
//       }, error: errorCallback})
//     },
//     error: function (errors) {
//       ShopifyPOS.flashError("Oops! Something went wrong.")
//       console.error(errors)
//     }
//   });
// }

// function removePropertyFromCart() {
//   var propertyName = $('#prop-to-remove').val();

//   ShopifyPOS.fetchCart({
//     success: function (cart) {
//       cart.removeProperties([propertyName], {success: function(cart) {
//         successCallback("Cart property removed");
//       }, error: errorCallback})
//     },
//     error: function (errors) {
//       ShopifyPOS.flashError("Oops! Something went wrong.")
//       console.error(errors)
//     }
//   });
// }

// function addPhoneNumberToCartCustomer() {
//   ShopifyPOS.fetchCart({
//     success: function (cart) {
//       var data = {phone: $('#customer-phone').val()}

//       if (cart.customer.addresses && cart.customer.addresses.length > 0) {
//         cart.updateCustomerAddress(0, data, {success: function(cart) {
//         successCallback("Customer phone number added");
//       }, error: errorCallback})
//       } else {
//         cart.addCustomerAddress(data, {success: function(cart) {
//         successCallback("Customer phone number added");
//       }, error: errorCallback})
//       }
//     },
//     error: function (errors) {
//       ShopifyPOS.flashError("Oops! Something went wrong.")
//       console.error(errors)
//     }
//   });
// }
