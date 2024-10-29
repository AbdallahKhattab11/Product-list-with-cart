import {handleNumberOfElementsInCart} from './main.js'

export function show_hidden(showElement, hiddenElement) {
  showElement.classList.remove("hidden");
  hiddenElement.classList.add("hidden");
}

export function addSelectedClassToItem(item) {
  item.classList.add("selected");
}

export function addBorderToImg(img) {
  img.classList.add("border");
}

export function getSelectedItems(allDessertItems) {
  let selected = Array.from(allDessertItems).filter((item) =>
    item.classList.contains("selected")
  );

  return selected;
}

export function handleCart(name, price, itemsCount, i) {
  let emptyDiv = document.querySelector(".cart .empty-div");
  let itemsDiv = document.querySelector(".cart .items-div");
  let currentlyItems = document.querySelector(
    ".cart .items-div .currently-items"
  );
  show_hidden(itemsDiv, emptyDiv);
  currentlyItems.appendChild(createItemForCart(name, price, itemsCount, i));
}

function createItemForCart(name, price, itemsCount, i) {
  let finalCalculation = price * itemsCount;

  let cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  cartItem.setAttribute("data-item-cart", i);
  cartItem.innerHTML = `
    <div class="item-details">
    <h3 class="name">${name}</h3>
    <div class="details">
      <div class="items-count"><span class="count">${itemsCount}</span>x</div>
      <div class="price-per-item">@<span class="price">${price}</span></div>
      <div class="final-calculation">$<span class="calculation">${finalCalculation.toFixed(
        2
      )}</span></div>
    </div>
  </div>
  <div class="delete-btn">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      fill="none"
      viewBox="0 0 10 10"
    >
      <path
        fill="#CAAFA7"
        d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"
      />
    </svg>
  </div>
  `;

  return cartItem;
}

export function updateCartItemQuantity(action, number, id) {
  // update number
  let count = number.textContent;

  if (action === "decrement" && count > 1) {
    count--;
  }
  if (action === "increment") {
    count++;
  }

  number.textContent = count;

  // update cart item
  let currentlyItemsDiv = document.querySelector(".cart .currently-items");
  if (currentlyItemsDiv.children.length > 0) {
    for (let i = 0; i < currentlyItemsDiv.children.length; i++) {
      let cartItemId =
        currentlyItemsDiv.children[i].getAttribute("data-item-cart");

      if (cartItemId == id) {
        let quantity = currentlyItemsDiv.children[i].querySelector(
          ".item-details .details .items-count .count"
        );
        let f_calculation = currentlyItemsDiv.children[i].querySelector(
          ".item-details .details .final-calculation .calculation"
        );
        let price = currentlyItemsDiv.children[i].querySelector(
          ".item-details .details .price-per-item .price"
        );
        quantity.textContent = count;
        f_calculation.textContent = parseInt(
          price.textContent * quantity.textContent
        ).toFixed(2);
      }
    }
  }
  handleOrderTotal();
}
export function handleOrderTotal() {
  let allItemsInCart = document.querySelector(".cart .currently-items");
  let total = 0;
  for (let i = 0; i < allItemsInCart.children.length; i++) {
    let finalCalculation = allItemsInCart.children[i].querySelector(
      ".final-calculation .calculation"
    ).textContent;
    total += parseFloat(finalCalculation);
  }
  document.querySelector(
    ".cart .order-total .total-price"
  ).textContent = `$${total.toFixed(2)}`;
}

export function handleStartNewOrderBtn() {
  // clear the cart
  let emptyDiv = document.querySelector(".cart .empty-div");
  let itemsDiv = document.querySelector(".cart .items-div");
  let currentlyItemsDiv = itemsDiv.querySelector(".currently-items")
  while(currentlyItemsDiv.firstElementChild) {
    currentlyItemsDiv.removeChild(currentlyItemsDiv.firstElementChild)
  }
  // update number of items in cart
  handleNumberOfElementsInCart()

  // hide the items div
  show_hidden(emptyDiv,itemsDiv)

  // hide the modal div
  let modal = document.querySelector("body .modal");
  modal.classList.add("hidden")

  // get the selected items
  let allDessertItems = document.querySelectorAll(".desserts .items .item")
  let selectedItems = Array.from(allDessertItems).filter((item) => {
    return item.classList.contains("selected")
  })
  
  selectedItems.forEach((item) => {
    // remove selected class
    item.classList.remove("selected")
    // remove border 
    let img = item.querySelector(".top .img-container img.border");
    img.classList.remove("border");

    // reset number
    let number = item.querySelector(".top .add-to-cart .number-of-items .number");
    number.textContent = 1;

    let addToCart = item.querySelector(".top .add-to-cart .add-btn");
    let numberOfItemsDiv = item.querySelector(".top .add-to-cart .number-of-items");
    show_hidden(addToCart, numberOfItemsDiv)
  })
  
  
  
}






