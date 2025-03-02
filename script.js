// Data
let users = []; // Store registered users
let cart = {}; // Store cart items
let discount = 0; // Store discount percentage
let selectedStore = ""; // Store selected store
let selectedSlot = ""; // Store selected delivery slot

const stores = ["Store 1", "Store 2", "Store 3"];
const categories = ["Groceries", "Dairy", "Soft Drinks", "Instant Foods", "Fruits"];
const items = {
  Groceries: ["Rice", "Wheat", "Pulses"],
  Dairy: ["Milk", "Cheese", "Butter"],
  "Soft Drinks": ["Coke", "Pepsi", "Sprite"],
  "Instant Foods": ["Noodles", "Pasta", "Soup"],
  Fruits: ["Apple", "Banana", "Orange"],
};
const prices = {
  Rice: 50,
  Wheat: 40,
  Pulses: 60,
  Milk: 30,
  Cheese: 80,
  Butter: 70,
  Coke: 20,
  Pepsi: 20,
  Sprite: 20,
  Noodles: 25,
  Pasta: 30,
  Soup: 35,
  Apple: 10,
  Banana: 5,
  Orange: 8,
};

// Page Navigation
function goToPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

// Login Form Submission
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const phone = document.getElementById("login-phone").value;
  const password = document.getElementById("login-password").value;

  const user = users.find((u) => u.phone === phone && u.password === password);
  if (user) {
    alert("Login successful!");
    goToPage("store-selection");
  } else {
    alert("Invalid phone number or password.");
  }
});

// Sign-Up Form Submission
document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("signup-name").value;
  const hostelBlock = document.getElementById("signup-hostel-block").value;
  const roomNumber = document.getElementById("signup-room-number").value;
  const phone = document.getElementById("signup-phone").value;
  const password = document.getElementById("signup-password").value;

  // Check if the phone number is already registered
  const existingUser = users.find((u) => u.phone === phone);
  if (existingUser) {
    alert("This phone number is already registered. Please login.");
    goToPage("login");
    return;
  }

  const newUser = {
    name,
    hostelBlock,
    roomNumber,
    phone,
    password,
  };

  users.push(newUser);
  alert("Sign-up successful! Please login.");
  goToPage("login");
});

// Store Selection
function selectStore(store) {
  if (Object.keys(cart).length > 0 && !confirm("Changing the store will clear your cart. Proceed?")) return;
  cart = {};
  selectedStore = store;
  goToPage("category-selection");
  renderCategories();
}

// Render Categories
function renderCategories() {
  const categoryButtons = document.querySelector(".category-buttons");
  categoryButtons.innerHTML = categories
    .map((category) => `<button onclick="selectCategory('${category}')">${category}</button>`)
    .join("");
}

// Category Selection
function selectCategory(category) {
  goToPage("item-selection");
  renderItems(category);
}

// Render Items
function renderItems(category) {
  const itemButtons = document.querySelector(".item-buttons");
  itemButtons.innerHTML = items[category]
    .map((item) => `<button onclick="addToCart('${item}')">${item} - ₹${prices[item]}</button>`)
    .join("");
}

// Add to Cart
function addToCart(item) {
  if (cart[item]) {
    cart[item].quantity += 1;
  } else {
    cart[item] = { quantity: 1, price: prices[item] };
  }
  goToPage("cart");
  renderCart();
}

// Render Cart
function renderCart() {
  const cartItems = document.querySelector(".cart-items");
  cartItems.innerHTML = Object.entries(cart)
    .map(
      ([item, details]) => `
      <div>
        <span>${item} (x${details.quantity}) - ₹${details.quantity * details.price}</span>
        <button onclick="removeFromCart('${item}')">-</button>
      </div>
    `
    )
    .join("");
  updateTotal();
}

// Remove from Cart
function removeFromCart(item) {
  if (cart[item].quantity > 1) {
    cart[item].quantity -= 1;
  } else {
    delete cart[item];
  }
  renderCart();
}

// Apply Promo Code
function applyPromoCode() {
  const promoCode = document.getElementById("promo-code").value;
  if (promoCode === "DISCOUNT10") {
    discount = 10;
    document.getElementById("promo-code-feedback").textContent = "Promo code applied! 10% discount.";
  } else {
    discount = 0;
    document.getElementById("promo-code-feedback").textContent = "Invalid promo code.";
  }
  updateTotal();
}

// Update Total
function updateTotal() {
  const subtotal = Object.values(cart).reduce((acc, { quantity, price }) => acc + quantity * price, 0);
  const deliveryFee = 7;
  const convenienceFee = 3;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + deliveryFee + convenienceFee - discountAmount;
  document.getElementById("total-amount").textContent = total.toFixed(2);
}

// Generate Bill
function generateBill() {
  selectedSlot = document.getElementById("delivery-slot").value;
  if (!selectedSlot) {
    alert("Please select a delivery slot.");
    return;
  }

  const billDetails = document.querySelector(".bill-details");
  billDetails.innerHTML = `
    <p><strong>Store:</strong> ${selectedStore}</p>
    <p><strong>Delivery Slot:</strong> ${selectedSlot}</p>
    <h3>Items:</h3>
    ${Object.entries(cart)
      .map(
        ([item, details]) => `
        <p>${item} (x${details.quantity}) - ₹${details.quantity * details.price}</p>
      `
      )
      .join("")}
    <p><strong>Subtotal:</strong> ₹${Object.values(cart).reduce((acc, { quantity, price }) => acc + quantity * price, 0).toFixed(2)}</p>
    <p><strong>Delivery Fee:</strong> ₹7.00</p>
    <p><strong>Convenience Fee:</strong> ₹3.00</p>
    <p><strong>Discount:</strong> ₹${(((Object.values(cart).reduce((acc, { quantity, price }) => acc + quantity * price, 0) * discount) / 100).toFixed(2))}</p>
    <p><strong>Total:</strong> ₹${document.getElementById("total-amount").textContent}</p>
  `;
  goToPage("bill");
}

// Initialize
goToPage("login");