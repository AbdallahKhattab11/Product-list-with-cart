const apiUrl = "./data.json";
const storedData = localStorage.getItem("dessertsData");
let itemsDiv = document.querySelector(".desserts .items");

if (storedData) {
  const data = JSON.parse(storedData);
  addData(data);
  handleAllChanges();
} else {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("dessertsData", JSON.stringify(data));
      addData(data);
      handleAllChanges();
    })
    .catch((error) => console.error("Error fetching data:", error));
}

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
      btn.classList.add("hidden");
      btn.nextElementSibling.classList.remove("hidden");
      if (!btn.nextElementSibling.classList.contains("hidden")) {
        let img = btn.parentElement.previousElementSibling.children[0];
        img.classList.add("border");

        let name =
          btn.parentElement.parentElement.nextElementSibling.firstElementChild
            .children[1].textContent;
        let price =
          btn.parentElement.parentElement.nextElementSibling.firstElementChild
            .children[2].textContent;
        let i =
          btn.parentElement.parentElement.parentElement.getAttribute(
            "data-item"
          );

        let numberOfItemsDiv = btn.nextElementSibling;
        let number = numberOfItemsDiv.children[1].textContent;
        handleCart(name, price, number, i);
        handleOrderTotal();

        let numberOfItemsDiv1 = document.querySelectorAll(
          ".desserts .items .item .top .add-to-cart .number-of-items"
        );
        numberOfItemsDiv1.forEach((item) => {
          if (!item.classList.contains("hidden")) {
            let currentlyItemsDiv = document.querySelector(
              ".cart .currently-items "
            );
            for (let i = 0; i < currentlyItemsDiv.children.length; i++) {
              if (
                currentlyItemsDiv.children[i].getAttribute("data-item-cart") ===
                item.parentElement.parentElement.parentElement.getAttribute(
                  "data-item"
                )
              ) {
                let itemCount =
                  currentlyItemsDiv.children[i].firstElementChild
                    .lastElementChild.firstElementChild.firstElementChild;
                let price =
                  currentlyItemsDiv.children[i].firstElementChild
                    .lastElementChild.children[1].firstElementChild;
                let finalCalculation =
                  currentlyItemsDiv.children[i].firstElementChild
                    .lastElementChild.children[2].firstElementChild;

                let decrement = item.children[0];
                let increment = item.children[2];

                // updating cart item quantity;
                increment.addEventListener("click", () =>
                  updateCartItemQuantity(
                    item,
                    "increment",
                    price,
                    finalCalculation,
                    itemCount
                  )
                );
                decrement.addEventListener("click", () =>
                  updateCartItemQuantity(
                    item,
                    "decrement",
                    price,
                    finalCalculation,
                    itemCount
                  )
                );
                // ---
              }
            }
          }
        });

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
      }
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

function handleCart(name, price, itemsCount, i) {
  let emptyDiv = document.querySelector(".cart .empty-div");
  let itemsDiv = document.querySelector(".cart .items-div");
  let currentlyItems = document.querySelector(
    ".cart .items-div .currently-items"
  );
  if (itemsDiv.classList.contains("hidden")) {
    itemsDiv.classList.remove("hidden");
    emptyDiv.classList.add("hidden");
    currentlyItems.appendChild(createItemForCart(name, price, itemsCount, i));
    let deleteBtn = document.querySelector(
      ".cart .currently-items .cart-item .delete-btn"
    );
    deleteBtn.addEventListener("mouseover", () => {
      let path = deleteBtn.children[0].children[0];
      path.setAttribute("fill", "#260f08");
    });
    deleteBtn.addEventListener("mouseout", () => {
      let path = deleteBtn.children[0].children[0];
      path.setAttribute("fill", "#CAAFA7");
    });
  } else {
    currentlyItems.appendChild(createItemForCart(name, price, itemsCount, i));
  }
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

function handleNumberOfElementsInCart() {
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

function handleOrderTotal() {
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

function updateCartItemQuantity(
  itemElement,
  action,
  price,
  f_Calculation,
  itemCount
) {
  console.log(itemElement, action, price, f_Calculation, itemCount)
  let numberElement = itemElement.querySelector(".number");
  let count = parseInt(numberElement.textContent);

  if (action === "increment") count++;
  if (action === "decrement" && count > 1) count--;

  numberElement.textContent = count;
  itemCount.textContent = count;

  let priceElement = price;
  let finalCalculation = f_Calculation;
  finalCalculation.textContent = (
    parseFloat(priceElement.textContent) * count
  ).toFixed(2);

  handleOrderTotal();
}

function handleCartDeleteItemBtn(element) {
  if (!element) return;
  const cartItem = element.closest(".cart-item");
  if (cartItem) {
    cartItem.remove();
    handleOrderTotal();
    handleNumberOfElementsInCart();

    let cartItemAttribute = cartItem.getAttribute("data-item-cart");
    updateNumberOfItemsInDesserts(cartItemAttribute)
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

  if (!modal.classList.contains("hidden")) {
    modal.addEventListener("click", (e) => {
      if (e.target === startNewOrderBtn) {
        console.log(true);
      } else {
        modal.classList.add("hidden");
      }
    });
  }
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
    let finalCalculationInCart = document.querySelector(".cart .order-total .total-price").textContent;
    let finalCalculationInModal = document.querySelector(".modal .modal-content .items-details .order-total .total-price");
    finalCalculationInModal.textContent = finalCalculationInCart;
  });
}

function updateNumberOfItemsInDesserts(cartItemAttribute) {
  let allDessertItems = document.querySelectorAll(".desserts .items .item") 
  if (allDessertItems) {
    allDessertItems.forEach(item => {
      if (item.getAttribute("data-item") == cartItemAttribute) {
        let number = item.querySelector(".top .add-to-cart .number-of-items .number");
        number.textContent = 1;
      }
    })
  }
  
}