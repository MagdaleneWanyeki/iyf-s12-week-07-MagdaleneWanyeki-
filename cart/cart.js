const CART_STORAGE_KEY = "week7_shopping_cart";

const state = {
    products: [
        {
            id: 1,
            name: "Mandazi (pack of 6)",
            price: 120,
            image: "https://placehold.co/64x64?text=Mandazi",
        },
        {
            id: 2,
            name: "Chapati (pack of 5)",
            price: 150,
            image: "https://placehold.co/64x64?text=Chapati",
        },
        {
            id: 3,
            name: "Tea leaves 250g",
            price: 180,
            image: "https://placehold.co/64x64?text=Tea",
        },
    ],
    cart: [], // { productId, quantity } — only the cart is persisted
    history: [], // snapshots of previous cart arrays for Undo
};

const productListEl = document.getElementById("product-list");
const cartItemsEl = document.getElementById("cart-items");
const cartBadgeEl = document.getElementById("cart-badge");
const cartTotalEl = document.getElementById("cart-total");
const undoBtn = document.getElementById("undo-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");

function cloneCart(cartItems) {
    return cartItems.map((item) => ({ ...item }));
}

function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
}

function loadCart() {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
        state.cart = [];
        return;
    }

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            state.cart = [];
            return;
        }

        state.cart = parsed.filter(
            (item) =>
                item &&
                typeof item.productId === "number" &&
                typeof item.quantity === "number" &&
                item.quantity > 0
        );
    } catch {
        state.cart = [];
    }
}

function recordHistory() {
    state.history = [...state.history, cloneCart(state.cart)];
}

function commitCartChange({ saveHistory = true } = {}) {
    if (saveHistory) {
        recordHistory();
    }
    saveCart();
    renderCart();
}

function getProductById(productId) {
    return state.products.find((product) => product.id === productId);
}

function getCartTotal() {
    return state.cart.reduce((total, item) => {
        const product = getProductById(item.productId);
        if (!product) {
            return total;
        }
        return total + product.price * item.quantity;
    }, 0);
}

function getCartCount() {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
}

function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) {
        return;
    }

    recordHistory();

    const existing = state.cart.find((item) => item.productId === productId);
    if (existing) {
        state.cart = state.cart.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
    } else {
        state.cart = [...state.cart, { productId, quantity: 1 }];
    }

    saveCart();
    renderCart();
}

function updateQuantity(productId, quantity) {
    const nextQty = Number(quantity);
    if (Number.isNaN(nextQty)) {
        return;
    }

    recordHistory();

    if (nextQty <= 0) {
        state.cart = state.cart.filter((item) => item.productId !== productId);
    } else {
        state.cart = state.cart.map((item) =>
            item.productId === productId ? { ...item, quantity: nextQty } : item
        );
    }

    saveCart();
    renderCart();
}

function removeFromCart(productId) {
    recordHistory();
    state.cart = state.cart.filter((item) => item.productId !== productId);
    saveCart();
    renderCart();
}

function clearCart() {
    if (state.cart.length === 0) {
        return;
    }
    recordHistory();
    state.cart = [];
    saveCart();
    renderCart();
}

function undoLastChange() {
    if (state.history.length === 0) {
        return;
    }
    const previousCart = state.history[state.history.length - 1];
    state.history = state.history.slice(0, -1);
    state.cart = cloneCart(previousCart);
    commitCartChange({ saveHistory: false });
}

function renderProducts() {
    productListEl.innerHTML = "";

    state.products.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;

        const info = document.createElement("div");
        info.className = "product-info";

        const title = document.createElement("h3");
        title.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = `KSh ${product.price}`;

        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.dataset.action = "add";
        addBtn.dataset.productId = String(product.id);
        addBtn.textContent = "Add to Cart";

        info.append(title, price);
        card.append(img, info, addBtn);
        productListEl.appendChild(card);
    });
}

function renderCart() {
    cartItemsEl.innerHTML = "";

    if (state.cart.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "Your cart is empty.";
        cartItemsEl.appendChild(emptyMsg);
    } else {
        state.cart.forEach((item) => {
            const product = getProductById(item.productId);
            if (!product) {
                return;
            }

            const row = document.createElement("div");
            row.className = "cart-item";
            row.dataset.productId = String(item.productId);

            const nameSpan = document.createElement("span");
            nameSpan.textContent = `${product.name} — KSh ${product.price * item.quantity}`;

            const controls = document.createElement("div");
            controls.className = "cart-controls";

            const decBtn = document.createElement("button");
            decBtn.type = "button";
            decBtn.dataset.action = "decrement";
            decBtn.textContent = "−";

            const qtySpan = document.createElement("span");
            qtySpan.textContent = String(item.quantity);

            const incBtn = document.createElement("button");
            incBtn.type = "button";
            incBtn.dataset.action = "increment";
            incBtn.textContent = "+";

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.dataset.action = "remove";
            removeBtn.textContent = "Remove";

            controls.append(decBtn, qtySpan, incBtn, removeBtn);
            row.append(nameSpan, controls);
            cartItemsEl.appendChild(row);
        });
    }

    const totalItems = getCartCount();
    cartBadgeEl.innerHTML = `Cart: <strong>${totalItems}</strong> ${
        totalItems === 1 ? "item" : "items"
    }`;
    cartTotalEl.textContent = String(getCartTotal());
    undoBtn.disabled = state.history.length === 0;
}

productListEl.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action='add']");
    if (!button) {
        return;
    }
    addToCart(Number(button.dataset.productId));
});

cartItemsEl.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) {
        return;
    }

    const row = button.closest("[data-product-id]");
    if (!row) {
        return;
    }

    const productId = Number(row.dataset.productId);
    const currentItem = state.cart.find((item) => item.productId === productId);
    if (!currentItem) {
        return;
    }

    const action = button.dataset.action;
    if (action === "increment") {
        updateQuantity(productId, currentItem.quantity + 1);
    } else if (action === "decrement") {
        updateQuantity(productId, currentItem.quantity - 1);
    } else if (action === "remove") {
        removeFromCart(productId);
    }
});

clearCartBtn.addEventListener("click", clearCart);
undoBtn.addEventListener("click", undoLastChange);

loadCart();
renderProducts();
renderCart();