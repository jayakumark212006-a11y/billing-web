const STORAGE_KEYS = {
  menu: "tea-shop-menu",
  sales: "tea-shop-sales"
};

const fallbackImages = {
  "methu vada": "assets/methu-vada.svg",
  "paruppu vada": "assets/paruppu-vada.svg",
  tea: "assets/tea.svg",
  coffee: "assets/coffee.svg",
  "butter milk": "assets/butter-milk.svg",
  "lemon juice": "assets/lemon-juice.svg",
  snack: "assets/snack-generic.svg",
  drink: "assets/drink-generic.svg"
};

const openSourceImages = {
  "Methu Vada": "https://commons.wikimedia.org/wiki/Special:FilePath/Medu%20vada2.jpg",
  "Paruppu Vada": "https://commons.wikimedia.org/wiki/Special:FilePath/Paripu%20vada.jpg",
  Tea: "https://commons.wikimedia.org/wiki/Special:FilePath/Masala%20tea.jpg",
  Coffee: "https://commons.wikimedia.org/wiki/Special:FilePath/Coffee%20Cup%20%281969787621%29.jpg",
  "Butter Milk": "https://commons.wikimedia.org/wiki/Special:FilePath/Drinking%20buttermilk.jpg",
  "Lemon Juice": "https://commons.wikimedia.org/wiki/Special:FilePath/Lemon%20juice.jpg"
};

const imageCredits = [
  {
    item: "Methu Vada",
    author: "Nick Gray",
    license: "CC BY-SA 2.0",
    page: "https://commons.wikimedia.org/wiki/File:Medu_vada2.jpg"
  },
  {
    item: "Paruppu Vada",
    author: "Sherin",
    license: "CC BY-SA 4.0",
    page: "https://commons.wikimedia.org/wiki/File:Paripu_vada.jpg"
  },
  {
    item: "Tea",
    author: "Ravi Daj",
    license: "CC BY-SA 4.0",
    page: "https://commons.wikimedia.org/wiki/File:Masala_tea.jpg"
  },
  {
    item: "Coffee",
    author: "Augie Schwer",
    license: "CC BY-SA 2.0",
    page: "https://commons.wikimedia.org/wiki/File:Coffee_Cup_(1969787621).jpg"
  },
  {
    item: "Butter Milk",
    author: "Dr. Satish Upalkar",
    license: "CC BY-SA 4.0",
    page: "https://commons.wikimedia.org/wiki/File:Drinking_buttermilk.jpg"
  },
  {
    item: "Lemon Juice",
    author: "David Goehring",
    license: "CC BY 2.0",
    page: "https://commons.wikimedia.org/wiki/File:Lemon_juice.jpg"
  }
];

const defaultMenu = [
  { id: crypto.randomUUID(), name: "Methu Vada", price: 12, category: "Snack", image: openSourceImages["Methu Vada"] },
  { id: crypto.randomUUID(), name: "Paruppu Vada", price: 10, category: "Snack", image: openSourceImages["Paruppu Vada"] },
  { id: crypto.randomUUID(), name: "Tea", price: 15, category: "Drink", image: openSourceImages.Tea },
  { id: crypto.randomUUID(), name: "Coffee", price: 20, category: "Drink", image: openSourceImages.Coffee },
  { id: crypto.randomUUID(), name: "Butter Milk", price: 18, category: "Drink", image: openSourceImages["Butter Milk"] },
  { id: crypto.randomUUID(), name: "Lemon Juice", price: 25, category: "Drink", image: openSourceImages["Lemon Juice"] }
];

const state = {
  menu: loadMenu(),
  cart: [],
  sales: loadSales(),
  editingId: null
};

const elements = {
  menuGrid: document.getElementById("menuGrid"),
  menuSearch: document.getElementById("menuSearch"),
  cartItems: document.getElementById("cartItems"),
  emptyCartState: document.getElementById("emptyCartState"),
  totalQuantity: document.getElementById("totalQuantity"),
  subtotalAmount: document.getElementById("subtotalAmount"),
  totalAmount: document.getElementById("totalAmount"),
  clearCartBtn: document.getElementById("clearCartBtn"),
  printBillBtn: document.getElementById("printBillBtn"),
  payNowBtn: document.getElementById("payNowBtn"),
  printBillItems: document.getElementById("printBillItems"),
  printTotalAmount: document.getElementById("printTotalAmount"),
  printTimestamp: document.getElementById("printTimestamp"),
  billDate: document.getElementById("billDate"),
  todayOrders: document.getElementById("todayOrders"),
  todayRevenue: document.getElementById("todayRevenue"),
  menuCount: document.getElementById("menuCount"),
  reportMonth: document.getElementById("reportMonth"),
  reportRevenue: document.getElementById("reportRevenue"),
  reportOrders: document.getElementById("reportOrders"),
  reportItemsSold: document.getElementById("reportItemsSold"),
  topSellingItem: document.getElementById("topSellingItem"),
  salesTableBody: document.getElementById("salesTableBody"),
  menuForm: document.getElementById("menuForm"),
  itemId: document.getElementById("itemId"),
  itemName: document.getElementById("itemName"),
  itemPrice: document.getElementById("itemPrice"),
  itemCategory: document.getElementById("itemCategory"),
  itemImage: document.getElementById("itemImage"),
  saveItemBtn: document.getElementById("saveItemBtn"),
  resetFormBtn: document.getElementById("resetFormBtn"),
  manageMenuBody: document.getElementById("manageMenuBody"),
  paymentModal: document.getElementById("paymentModal"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  paymentAmountText: document.getElementById("paymentAmountText"),
  qrImage: document.getElementById("qrImage"),
  confirmPaymentBtn: document.getElementById("confirmPaymentBtn"),
  menuCardTemplate: document.getElementById("menuCardTemplate")
};

init();

function init() {
  elements.billDate.textContent = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  elements.reportMonth.value = getMonthInputValue(new Date());

  bindEvents();
  renderAll();
}

function bindEvents() {
  elements.menuSearch.addEventListener("input", renderMenu);
  elements.clearCartBtn.addEventListener("click", clearCart);
  elements.printBillBtn.addEventListener("click", handlePrint);
  elements.payNowBtn.addEventListener("click", openPaymentModal);
  elements.closeModalBtn.addEventListener("click", closePaymentModal);
  elements.paymentModal.addEventListener("click", (event) => {
    if (event.target === elements.paymentModal) closePaymentModal();
  });
  elements.confirmPaymentBtn.addEventListener("click", completePayment);
  elements.reportMonth.addEventListener("change", renderReport);
  elements.menuForm.addEventListener("submit", handleMenuSubmit);
  elements.resetFormBtn.addEventListener("click", resetForm);
  elements.qrImage.addEventListener("error", () => {
    elements.qrImage.src = "assets/payment-qr-fallback.svg";
  });
}

function renderAll() {
  renderMenu();
  renderCart();
  renderManageMenu();
  renderReport();
  renderHighlights();
  renderImageCredits();
}

function renderImageCredits() {
  const container = document.getElementById("imageCredits");
  if (!container) return;

  container.innerHTML = "";
  imageCredits.forEach((credit) => {
    const card = document.createElement("article");
    card.className = "credit-card";
    card.innerHTML = `
      <h3>${credit.item}</h3>
      <p>Photo by ${credit.author}</p>
      <p>${credit.license}</p>
      <p><a href="${credit.page}" target="_blank" rel="noreferrer">View source</a></p>
    `;
    container.appendChild(card);
  });
}

function renderMenu() {
  const searchTerm = elements.menuSearch.value.trim().toLowerCase();
  const filteredMenu = state.menu.filter((item) => item.name.toLowerCase().includes(searchTerm));
  elements.menuGrid.innerHTML = "";

  if (!filteredMenu.length) {
    elements.menuGrid.innerHTML = '<div class="empty-table">No menu items found.</div>';
    return;
  }

  filteredMenu.forEach((item) => {
    const fragment = elements.menuCardTemplate.content.cloneNode(true);
    const image = fragment.querySelector(".menu-card-image");
    const category = fragment.querySelector(".item-category");
    const price = fragment.querySelector(".item-price");
    const name = fragment.querySelector(".item-name");
    const button = fragment.querySelector(".add-item-btn");

    image.src = resolveImage(item);
    image.alt = item.name;
    image.onerror = () => {
      image.src = getCategoryFallback(item.category);
    };
    category.textContent = item.category;
    price.textContent = formatCurrency(item.price);
    name.textContent = item.name;
    button.addEventListener("click", () => addToCart(item.id));

    elements.menuGrid.appendChild(fragment);
  });
}

function renderCart() {
  elements.cartItems.innerHTML = "";
  const hasItems = state.cart.length > 0;
  elements.emptyCartState.style.display = hasItems ? "none" : "block";

  state.cart.forEach((cartItem) => {
    const item = getMenuItem(cartItem.id);
    if (!item) return;

    const wrapper = document.createElement("article");
    wrapper.className = "cart-item";
    wrapper.innerHTML = `
      <img src="${resolveImage(item)}" alt="${item.name}">
      <div>
        <h3>${item.name}</h3>
        <p>${formatCurrency(item.price)} each</p>
        <div class="cart-controls">
          <button class="icon-btn decrease-btn" type="button">-</button>
          <strong>${cartItem.quantity}</strong>
          <button class="icon-btn increase-btn" type="button">+</button>
          <button class="icon-btn remove-btn" type="button" title="Remove item">x</button>
        </div>
      </div>
      <div class="item-total">${formatCurrency(item.price * cartItem.quantity)}</div>
    `;

    wrapper.querySelector("img").addEventListener("error", (event) => {
      event.currentTarget.src = getCategoryFallback(item.category);
    });
    wrapper.querySelector(".decrease-btn").addEventListener("click", () => changeQuantity(item.id, -1));
    wrapper.querySelector(".increase-btn").addEventListener("click", () => changeQuantity(item.id, 1));
    wrapper.querySelector(".remove-btn").addEventListener("click", () => removeFromCart(item.id));
    elements.cartItems.appendChild(wrapper);
  });

  const totals = getCartTotals();
  elements.totalQuantity.textContent = String(totals.quantity);
  elements.subtotalAmount.textContent = formatCurrency(totals.total);
  elements.totalAmount.textContent = formatCurrency(totals.total);
  elements.printTotalAmount.textContent = formatCurrency(totals.total);
  renderPrintableBill();
}

function renderPrintableBill() {
  elements.printTimestamp.textContent = new Date().toLocaleString("en-IN");
  elements.printBillItems.innerHTML = "";

  if (!state.cart.length) {
    elements.printBillItems.innerHTML = '<div class="empty-table">No items in the bill.</div>';
    return;
  }

  state.cart.forEach((cartItem) => {
    const item = getMenuItem(cartItem.id);
    if (!item) return;

    const row = document.createElement("div");
    row.className = "print-row";
    row.innerHTML = `
      <span>${item.name} x ${cartItem.quantity}</span>
      <strong>${formatCurrency(item.price * cartItem.quantity)}</strong>
    `;
    elements.printBillItems.appendChild(row);
  });
}

function renderManageMenu() {
  elements.manageMenuBody.innerHTML = "";

  state.menu.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${formatCurrency(item.price)}</td>
      <td class="action-row">
        <button class="btn btn-outline edit-btn" type="button">Edit</button>
        <button class="btn btn-muted delete-btn" type="button">Delete</button>
      </td>
    `;

    row.querySelector(".edit-btn").addEventListener("click", () => populateForm(item));
    row.querySelector(".delete-btn").addEventListener("click", () => deleteMenuItem(item.id));
    elements.manageMenuBody.appendChild(row);
  });
}

function renderHighlights() {
  const today = new Date().toISOString().slice(0, 10);
  const todaySales = state.sales.filter((sale) => sale.timestamp.startsWith(today));
  const revenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);

  elements.todayOrders.textContent = String(todaySales.length);
  elements.todayRevenue.textContent = formatCurrency(revenue);
  elements.menuCount.textContent = String(state.menu.length);
}

function renderReport() {
  const monthValue = elements.reportMonth.value || getMonthInputValue(new Date());
  const [year, month] = monthValue.split("-");
  const filteredSales = state.sales.filter((sale) => {
    const saleDate = new Date(sale.timestamp);
    return saleDate.getFullYear() === Number(year) && saleDate.getMonth() + 1 === Number(month);
  });

  const revenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const itemsSold = filteredSales.reduce((sum, sale) => {
    return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);

  const itemMap = new Map();
  filteredSales.forEach((sale) => {
    sale.items.forEach((item) => {
      itemMap.set(item.name, (itemMap.get(item.name) || 0) + item.quantity);
    });
  });

  let topItem = "-";
  let topCount = 0;
  itemMap.forEach((count, name) => {
    if (count > topCount) {
      topCount = count;
      topItem = name;
    }
  });

  elements.reportRevenue.textContent = formatCurrency(revenue);
  elements.reportOrders.textContent = String(filteredSales.length);
  elements.reportItemsSold.textContent = String(itemsSold);
  elements.topSellingItem.textContent = topItem;

  elements.salesTableBody.innerHTML = "";
  if (!filteredSales.length) {
    elements.salesTableBody.innerHTML = '<tr><td colspan="3" class="empty-table">No sales found for this month.</td></tr>';
    return;
  }

  filteredSales
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .forEach((sale) => {
      const row = document.createElement("tr");
      const itemsSummary = sale.items.map((item) => `${item.name} x ${item.quantity}`).join(", ");
      row.innerHTML = `
        <td>${new Date(sale.timestamp).toLocaleString("en-IN")}</td>
        <td>${itemsSummary}</td>
        <td>${formatCurrency(sale.total)}</td>
      `;
      elements.salesTableBody.appendChild(row);
    });
}

function addToCart(itemId) {
  const existing = state.cart.find((item) => item.id === itemId);
  if (existing) existing.quantity += 1;
  else state.cart.push({ id: itemId, quantity: 1 });
  renderCart();
}

function changeQuantity(itemId, delta) {
  const cartItem = state.cart.find((item) => item.id === itemId);
  if (!cartItem) return;

  cartItem.quantity += delta;
  if (cartItem.quantity <= 0) {
    state.cart = state.cart.filter((item) => item.id !== itemId);
  }

  renderCart();
}

function removeFromCart(itemId) {
  state.cart = state.cart.filter((item) => item.id !== itemId);
  renderCart();
}

function clearCart() {
  state.cart = [];
  renderCart();
}

function handlePrint() {
  if (!state.cart.length) {
    alert("Add at least one item before printing the bill.");
    return;
  }
  window.print();
}

function openPaymentModal() {
  const totals = getCartTotals();
  if (!totals.quantity) {
    alert("Add items to the cart before payment.");
    return;
  }

  elements.paymentAmountText.textContent = `Pay ${formatCurrency(totals.total)} to complete this bill.`;
  elements.qrImage.src = buildQrUrl(totals.total);
  elements.paymentModal.classList.remove("hidden");
}

function closePaymentModal() {
  elements.paymentModal.classList.add("hidden");
}

function completePayment() {
  if (!state.cart.length) {
    closePaymentModal();
    return;
  }

  const items = state.cart.map((cartItem) => {
    const menuItem = getMenuItem(cartItem.id);
    return {
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: cartItem.quantity
    };
  });

  const totals = getCartTotals();
  state.sales.push({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    items,
    total: totals.total
  });

  saveSales();
  clearCart();
  closePaymentModal();
  renderReport();
  renderHighlights();
  alert("Payment recorded successfully.");
}

function handleMenuSubmit(event) {
  event.preventDefault();

  const name = elements.itemName.value.trim();
  const price = Number(elements.itemPrice.value);
  const category = elements.itemCategory.value;
  const image = elements.itemImage.value.trim();
  if (!name || !price) return;

  const menuItem = {
    id: state.editingId || crypto.randomUUID(),
    name,
    price,
    category,
    image: image || openSourceImages[name] || getFallbackImage(name, category)
  };

  if (state.editingId) {
    state.menu = state.menu.map((item) => (item.id === state.editingId ? menuItem : item));
  } else {
    state.menu.push(menuItem);
  }

  saveMenu();
  resetForm();
  renderAll();
}

function populateForm(item) {
  state.editingId = item.id;
  elements.itemId.value = item.id;
  elements.itemName.value = item.name;
  elements.itemPrice.value = String(item.price);
  elements.itemCategory.value = item.category;
  elements.itemImage.value = item.image || "";
  elements.saveItemBtn.textContent = "Update Item";
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

function resetForm() {
  state.editingId = null;
  elements.menuForm.reset();
  elements.itemCategory.value = "Snack";
  elements.saveItemBtn.textContent = "Add Item";
  elements.itemId.value = "";
}

function deleteMenuItem(itemId) {
  if (state.cart.some((item) => item.id === itemId)) {
    removeFromCart(itemId);
  }

  state.menu = state.menu.filter((item) => item.id !== itemId);
  saveMenu();

  if (state.editingId === itemId) resetForm();
  renderAll();
}

function getCartTotals() {
  return state.cart.reduce((totals, cartItem) => {
    const menuItem = getMenuItem(cartItem.id);
    if (!menuItem) return totals;

    totals.quantity += cartItem.quantity;
    totals.total += menuItem.price * cartItem.quantity;
    return totals;
  }, { quantity: 0, total: 0 });
}

function getMenuItem(itemId) {
  return state.menu.find((item) => item.id === itemId);
}

function buildQrUrl(total) {
  const paymentPayload = `upi://pay?pa=teashop@upi&pn=Tea%20Shop&am=${total}&cu=INR`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(paymentPayload)}`;
}

function resolveImage(item) {
  return item.image || getFallbackImage(item.name, item.category);
}

function getFallbackImage(name, category) {
  return fallbackImages[name.trim().toLowerCase()] || getCategoryFallback(category);
}

function getCategoryFallback(category) {
  return fallbackImages[category.trim().toLowerCase()] || fallbackImages.drink;
}

function loadMenu() {
  const saved = localStorage.getItem(STORAGE_KEYS.menu);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.menu, JSON.stringify(defaultMenu));
    return defaultMenu;
  }

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length) {
      const hydratedMenu = parsed.map((item) => {
        const sourceImage = openSourceImages[item.name];
        const shouldUpgradeImage = typeof item.image === "string" && item.image.startsWith("assets/");
        return shouldUpgradeImage && sourceImage ? { ...item, image: sourceImage } : item;
      });

      localStorage.setItem(STORAGE_KEYS.menu, JSON.stringify(hydratedMenu));
      return hydratedMenu;
    }

    return defaultMenu;
  } catch {
    return defaultMenu;
  }
}

function saveMenu() {
  localStorage.setItem(STORAGE_KEYS.menu, JSON.stringify(state.menu));
}

function loadSales() {
  const saved = localStorage.getItem(STORAGE_KEYS.sales);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSales() {
  localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(state.sales));
}

function formatCurrency(amount) {
  return `Rs. ${Number(amount).toFixed(0)}`;
}

function getMonthInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}
