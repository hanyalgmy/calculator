"use strict";
//next line need a fix
//const mongo = require('mongoose')
//mongo.connect(`mongodb+srv://Just_Glitch:goldbe800@uwucafe.iapd6.mongodb.net/UwUCafeData?retryWrites=true&w=majority`);

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartDOM = document.querySelector(".cart");
const addToCartButtonsDOM = document.querySelectorAll(
  '[data-action="add-to-cart"]'
);

if (cart.length > 0) {
  cart.forEach(cartItem => {
    const product = cartItem;
    insertItemToDOM(product);
    countCartTotal();

    addToCartButtonsDOM.forEach(addToCartButtonDOM => {
      const productDOM = addToCartButtonDOM.parentNode;

      if (
        productDOM.querySelector(".product-name").innerText === product.name
      ) {
        handleActionButtons(addToCartButtonDOM, product);
      }
    });
  });
}

addToCartButtonsDOM.forEach(addToCartButtonDOM => {
  addToCartButtonDOM.addEventListener("click", () => {
    const productDOM = addToCartButtonDOM.parentNode;
    const product = {
      image: productDOM.querySelector(".product-image").getAttribute("src"),
      name: productDOM.querySelector(".product-name").innerText,
      price: productDOM.querySelector(".product-price").innerText,
      quantity: 1
    };

    cart.forEach(cartItem => {
      //console.log(cartItem.quantity, cartItem.price);
    });

    const isInCart =
      cart.filter(cartItem => cartItem.name === product.name).length > 0;

    if (!isInCart) {
      insertItemToDOM(product);
      cart.push(product);
      saveCart();
      handleActionButtons(addToCartButtonDOM, product);
    }
  });
});

function insertItemToDOM(product) {
  cartDOM.insertAdjacentHTML(
    "beforeend",
    `
    <div class="cart-item">
        <img class="cart-item-image" src="${product.image}" alt="${product.name
    }" />
        <h2 class="cart-item-name">${product.name}</h2>
        <h4 class="cart-item-price">${product.price}</h4>
        <button class="btn btn-primary btn-small" data-action="decrease-item">
        &minus;
        </button>
        <h4 class="cart-item-quantity">${product.quantity}</h4>
        <button class="btn btn-primary btn-small" data-action="increase-item">
        &plus;
        </button>
        <button class="btn btn-primary btn-small" data-action="remove-item">
        <i class="fas fa-trash"></i>
        </button>
    </div>
    `
  );

  addCartFooter();
}

function handleActionButtons(addToCartButtonDOM, product) {
  addToCartButtonDOM.innerText = "In Cart";
  addToCartButtonDOM.disabled = true;

  const cartItemsDOM = cartDOM.querySelectorAll(".cart-item");
  cartItemsDOM.forEach(cartItemDOM => {
    if (
      cartItemDOM.querySelector(".cart-item-name").innerText === product.name
    ) {
      cartItemDOM
        .querySelector('[data-action="increase-item"]')
        .addEventListener("click", () => increaseItem(product, cartItemDOM));
      cartItemDOM
        .querySelector('[data-action="decrease-item"]')
        .addEventListener("click", () =>
          decreaseItem(product, cartItemDOM, addToCartButtonDOM)
        );
      cartItemDOM
        .querySelector('[data-action="remove-item"]')
        .addEventListener("click", () =>
          removeItem(product, cartItemDOM, addToCartButtonDOM)
        );
    }
  });
}

function increaseItem(product, cartItemDOM) {
  cart.forEach(cartItem => {
    if (cartItem.name === product.name) {
      cartItemDOM.querySelector(
        ".cart-item-quantity"
      ).innerText = ++cartItem.quantity;
      saveCart();
    }
  });
}

function decreaseItem(product, cartItemDOM, addToCartButtonDOM) {
  cart.forEach(cartItem => {
    if (cartItem.name === product.name) {
      if (cartItem.quantity > 1) {
        cartItemDOM.querySelector(
          ".cart-item-quantity"
        ).innerText = --cartItem.quantity;
        saveCart();
      } else {
        removeItem(product, cartItemDOM, addToCartButtonDOM);
      }
    }
  });
}

function removeItem(product, cartItemDOM, addToCartButtonDOM) {
  cartItemDOM.remove();
  cart = cart.filter(cartItem => cartItem.name !== product.name);
  saveCart();
  addToCartButtonDOM.innerText = "Add to Cart";
  addToCartButtonDOM.disabled = false;

  if (cart.length < 1) {
    document.querySelector(".cart-footer").remove();
  }
}

function addCartFooter() {
  if (document.querySelector(".cart-footer") === null) {
    cartDOM.insertAdjacentHTML(
      "afterend",
      `
        <div class="cart-footer">
          <h2 class="cart-footer-total" data-action="total-price">0</h2>
          <h5>Have a Coupon?</h5>
          <input type="text" name="coupon" class="cart-coupon" data-action="coupon-code" > 
          <button class="btn btn-primary btn-small btn-danger" data-action="apply-coupon">Apply</button>
          <br>
          <h5>Discount</h5>
          <input type="text" name="coupon" class="cart-coupon" data-action="discount-amount" > 
          <button class="btn btn-primary btn-small btn-danger" data-action="apply-discount">Apply</button>
            <button class="btn btn-primary btn-small btn-danger" data-action="reset-discount">reset</button>


          <br>
    <br>
          <button class="btn btn-primary btn-small btn-danger" data-action="clear-cart">Clear Cart</button>
          <button class="btn btn-primary btn-small btn-danger"  disabled data-action="checkout">Checkout</button>
        </div>
        `
    );

    document
      .querySelector('[data-action="apply-coupon"]')
      .addEventListener("click", () => applycoupon());
    document
      .querySelector('[data-action="apply-discount"]')
      .addEventListener("click", () => applydiscount());
    document
      .querySelector('[data-action="reset-discount"]')
      .addEventListener("click", () => resetdiscount());
    document
      .querySelector('[data-action="clear-cart"]')
      .addEventListener("click", () => clearCart());
    /*document
      .querySelector('[data-action="checkout"]')
      .addEventListener("click", () => checkout());*/
  }
}

function clearCart() {
  cartDOM.querySelectorAll(".cart-item").forEach(cartItemDOM => {
    cartItemDOM.remove();
  });

  cart = [];
  localStorage.removeItem("cart");
  document.querySelector(".cart-footer").remove();
  addToCartButtonsDOM.forEach(addToCartButtonDOM => {
    addToCartButtonDOM.innerText = "Add To Cart";
    addToCartButtonDOM.disabled = false;
  });
}

/*function checkout() {
  alert("Fuck Hesa");
  cart = [];
  localStorage.removeItem("cart");
  location.reload();
}*/

function countCartTotal() {
  let cartTotal = 0;
  cart.forEach(cartItem => (cartTotal += cartItem.quantity * cartItem.price));
  document.querySelector(
    '[data-action="total-price"]'
  ).innerText = `${cartTotal.toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  countCartTotal();
}

function applycoupon() {

  const Coupons = mongo.Schema({
    customerName: { type: String, unique: true, required: true },
    expiresOn: { type: Date },
    code: { type: String },
    status: { type: String, default: ('Valid') },
    codeInfoGuild: { type: String },
    value: { type: Number, default: 20 }
  })

  const Coupon = mongo.model("Coupons", Coupons);

  let inputcoupon = document.querySelector('[data-action="coupon-code"]').value

  if (!Coupon.exists({ code: `UwU-(${inputcoupon})` })) {
    alert("Please Enter valid Coupon code")
  }
  const couponInfo = Coupons.find({ code: `UwU-(${inputcoupon})` })
  if (couponInfo[0].status === 'Expired') {
    alert("Coupon Expired")
  }
  let cartTotal = 0;
  cart.forEach(cartItem => (cartTotal += cartItem.quantity * cartItem.price));
  let discount = cartTotal * couponInfo[0].value / 100
  let result = cartTotal - discount
  document.querySelector('[data-action="total-price"]').innerText = `${result.toFixed(2)}`;
}
function applydiscount() {

  let count = document.querySelector('[data-action="discount-amount"]').value
  if (count == 0) {
    alert("Please Enter valid Discount amount")
  } else {
    //console.log(count)
    let cartTotal = 0;
    cart.forEach(cartItem => (cartTotal += cartItem.quantity * cartItem.price));
    let discount = cartTotal * count / 100
    let result = cartTotal - discount
    document.querySelector('[data-action="total-price"]').innerText = `${result.toFixed(2)}`;
  }
}

function resetdiscount() {
  countCartTotal();
  document.querySelector('[data-action="discount-amount"]').value = ""
}