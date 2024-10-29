const apiUrl = "./data.json";

let itemsDiv = document.querySelector(".desserts .items");
// imports
import {
  show_hidden,
  addBorderToImg,
  addSelectedClassToItem,
  handleCart,
  updateCartItemQuantity,
  handleOrderTotal,
  getSelectedItems,
  handleStartNewOrderBtn
} from "./functions.js";


fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("dessertsData", JSON.stringify(data));
      addData(data);
      handleAllChanges();
    })
    .catch((error) => console.error("Error fetching data:", error));

function createItems(img, name, category, price, i) {
  let item = document.createElement("div");
  item.classList.add("item");
  item.setAttribute("data-item", i);

  let top = document.createElement("div");
  top.classList.add("top");
  top.innerHTML = `
    <div class="img-container">
      <img src= "${img}" alt="${name}">
    </div>
    <div class="add-to-cart">
      <div class="add-btn ">
        <img src="./assets/images/icon-add-to-cart.svg" alt="add-to-cart">
        <span>Add to Cart</span>
      </div>
      <div class="number-of-items hidden">
        <span class="decrement">
          <img src="./assets/images/icon-decrement-quantity.svg" alt="">
        </span>
        <span class="number">1</span>
        <span class="increment">
          <img src="./assets/images/icon-increment-quantity.svg" alt="">
        </span>
      </div>
    </div>
  `;

  item.appendChild(top);

  let bottom = document.createElement("div");
  bottom.classList.add("bottom");
  bottom.innerHTML = `
    <div class="details">
      <div class="category">${category}</div>
      <h2 class="name">${name}</h2>
      <span class="price">${price.toFixed(2)}</span>
    </div>
  `;

  item.appendChild(bottom);

  return item;
}

function addData(data) {
  let i = 0;
  data.forEach((obj) => {
    itemsDiv.appendChild(
      createItems(obj.image.desktop, obj.name, obj.category, obj.price, i)
    );
    i++;
  });
}

//todo    ----------------

function handleAllChanges() {
  let addToCartBtns = document.querySelectorAll(
    ".desserts .items .item .top .add-to-cart .add-btn"
  );

  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      show_hidden(btn.nextElementSibling, btn);

      // add selected class
      let dessertsItem = btn.parentElement.parentElement.parentElement;
      addSelectedClassToItem(dessertsItem);

      // add border to img
      let img = btn.parentElement.previousElementSibling.children[0];
      addBorderToImg(img);

      // create item in cart
      let name =
        btn.parentElement.parentElement.nextElementSibling.firstElementChild
          .children[1].textContent;
      let price =
        btn.parentElement.parentElement.nextElementSibling.firstElementChild
          .children[2].textContent;
      let i =
        btn.parentElement.parentElement.parentElement.getAttribute("data-item");
      let numberOfItemsDiv = btn.nextElementSibling;
      let number = numberOfItemsDiv.children[1].textContent;
      handleCart(name, price, number, i);

      let allDessertItems = document.querySelectorAll(".desserts .items .item");
      let allSelectedItems = getSelectedItems(allDessertItems);

      allSelectedItems.forEach((item) => {
        let numberOfItemsDiv = item.querySelector(".number-of-items");

        let id = item.getAttribute("data-item");

        let decrement = item.querySelector(
          ".top .add-to-cart .number-of-items .decrement"
        );
        let number = item.querySelector(
          ".top .add-to-cart .number-of-items .number"
        );
        let increment = item.querySelector(
          ".top .add-to-cart .number-of-items .increment"
        );

        decrement.onclick = ()=> {
          updateCartItemQuantity("decrement", number, id);
          
        }

        increment.onclick = ()=> {
          updateCartItemQuantity("increment", number, id);
          
        }

      });

      handleOrderTotal();

      let allItemsInCart = document.querySelectorAll(
        ".cart .currently-items .cart-item"
      );
      for (let j = 0; j < allItemsInCart.length; j++) {
        allItemsInCart[j].addEventListener("click", (event) => {
          if (event.target.closest(".delete-btn")) {
            handleCartDeleteItemBtn(event.target.closest(".delete-btn"));
          }
        });
      }

      handleNumberOfElementsInCart();

    });
  });

  let confirmOrderBtn = document.querySelector(
    ".cart .confirm-order .confirm-order-btn"
  );
  if (confirmOrderBtn) {
    confirmOrderBtn.addEventListener("click", () => {
      let cartItems = document.querySelectorAll(
        ".cart .currently-items .cart-item"
      );
      let allItemsData = [];
      cartItems.forEach((item) => {

        let id = item.getAttribute("data-item-cart");
        let name = item.querySelector(".item-details .name").textContent;
        let quantity = item.querySelector(".items-count .count").textContent;
        let price = item.querySelector(".price-per-item .price").textContent;
        let finalCalculation = item.querySelector(
          ".final-calculation .calculation"
        ).textContent;

        let dataItem = {
          id: id,
          name: name,
          price: price,
          quantity: quantity,
          finalCalculation: finalCalculation,
        };

        allItemsData.push(dataItem);
      });
      handleConfirmOrderBtn(allItemsData);
      
    });
  }
}

export function handleNumberOfElementsInCart() {
  let numberOfElementsInCart = document.querySelector(".cart .cart-title span");
  let currentlyItems = document.querySelector(".cart .currently-items");
  numberOfElementsInCart.textContent = currentlyItems.children.length;
  if (parseInt(numberOfElementsInCart.textContent) === 0) {
    let emptyDiv = document.querySelector(".cart .empty-div");
    let itemsDiv = document.querySelector(".cart .items-div");

    itemsDiv.classList.add("hidden");
    emptyDiv.classList.remove("hidden");
  }
}

function handleCartDeleteItemBtn(element) {
  if (!element) return;
  const cartItem = element.closest(".cart-item");
  if (cartItem) {
    cartItem.remove();
    handleOrderTotal();
    handleNumberOfElementsInCart();

    let cartItemAttribute = cartItem.getAttribute("data-item-cart");
    updateNumberOfItemsInDesserts(cartItemAttribute);
  }

  let itemId = cartItem.getAttribute("data-item-cart");
  let allItemsInDesserts = document.querySelectorAll(".desserts .items .item");
  allItemsInDesserts.forEach((item) => {
    if (item.getAttribute("data-item") === itemId) {
      let img = item.querySelector(".top .img-container img");
      let addToCart = item.querySelector(".top .add-to-cart .add-btn");
      let numberOfItemsDiv = item.querySelector(
        ".top .add-to-cart .number-of-items"
      );
      let number = numberOfItemsDiv.querySelector(".number");

      img.classList.remove("border");
      addToCart.classList.remove("hidden");
      numberOfItemsDiv.classList.add("hidden");
      number.textContent = 1;
    }
  });
}

function handleConfirmOrderBtn(allItemsData) {
  let modal = document.querySelector("body .modal");
  modal.classList.remove("hidden");

  CreateConfirmOrderItems(allItemsData);

  let startNewOrderBtn = document.querySelector(
    ".modal .modal-content .start-new-order-btn button"
  );


    modal.addEventListener("click", (e) => {
      if (e.target === startNewOrderBtn) {
        handleStartNewOrderBtn()
      } else {
        modal.classList.add("hidden");
      }
    });
}

function CreateConfirmOrderItems(allItemsData) {
  let modalItemsDiv = document.querySelector(
    ".modal .modal-content .items-details .items"
  );
  modalItemsDiv.innerHTML = "";

  allItemsData.forEach((objItem) => {
    let dessertItems = document.querySelectorAll("main .desserts .items .item");

    let imgSrc = "";
    dessertItems.forEach((item) => {
      if (item.getAttribute("data-item") == objItem.id) {
        imgSrc = item
          .querySelector(".top .img-container img")
          .getAttribute("src");
      }
    });

    let item = document.createElement("div");
    item.classList.add("item");
    item.setAttribute("data-id", objItem.id);

    item.innerHTML = `
      <div class="details">
    <div class="img">
      <img src=${imgSrc} alt=${objItem.name}>
    </div>
    <div class="item-details">
      <div class="name"><h3>${objItem.name}</h3></div>
      <span class="quantity">${objItem.quantity}x</span>
      <span class="price">@${objItem.price}</span>
    </div>
  </div>
  <div class="final-calculation">$${objItem.finalCalculation}</div>
    `;

    let modalItemsDiv = document.querySelector(
      ".modal .modal-content .items-details .items"
    );
    modalItemsDiv.appendChild(item);
    let finalCalculationInCart = document.querySelector(
      ".cart .order-total .total-price"
    ).textContent;
    let finalCalculationInModal = document.querySelector(
      ".modal .modal-content .items-details .order-total .total-price"
    );
    finalCalculationInModal.textContent = finalCalculationInCart;
  });
}

function updateNumberOfItemsInDesserts(cartItemAttribute) {
  let allDessertItems = document.querySelectorAll(".desserts .items .item");
  if (allDessertItems) {
    allDessertItems.forEach((item) => {
      if (item.getAttribute("data-item") == cartItemAttribute) {
        let number = item.querySelector(
          ".top .add-to-cart .number-of-items .number"
        );
        number.textContent = 1;
      }
    });
  }
}


