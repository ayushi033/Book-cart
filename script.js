
// ====================================
// BOOKCART - ONLINE BOOK SHOPPING CART
// ====================================

// Book Collection
const books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 350,
        icon: "📕",
        cover: "cover-1"
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        price: 499,
        icon: "📗",
        cover: "cover-2"
    },
    {
        id: 3,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 299,
        icon: "📘",
        cover: "cover-3"
    },
    {
        id: 4,
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        price: 399,
        icon: "📙",
        cover: "cover-4"
    },
    {
        id: 5,
        title: "Think Like a Monk",
        author: "Jay Shetty",
        price: 450,
        icon: "📔",
        cover: "cover-5"
    },
    {
        id: 6,
        title: "Ikigai",
        author: "Hector Garcia",
        price: 320,
        icon: "📒",
        cover: "cover-6"
    },
    {
        id: 7,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        price: 550,
        icon: "📓",
        cover: "cover-7"
    },
    {
        id: 8,
        title: "Deep Work",
        author: "Cal Newport",
        price: 425,
        icon: "📚",
        cover: "cover-8"
    }
];

// Shopping Cart
let cart = [];

try {
    const savedCart = JSON.parse(
        localStorage.getItem("bookcart") || "[]"
    );

    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(item =>
            books.some(book => book.id === Number(item.id)) &&
            Number.isInteger(Number(item.quantity)) &&
            Number(item.quantity) > 0
        ).map(item => ({
            id: Number(item.id),
            quantity: Number(item.quantity)
        }));
    }
} catch (error) {
    cart = [];
}

// HTML Elements
const bookList = document.getElementById("book-list");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartItemsCount = document.getElementById("cart-items-count");

const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");

const emptyCart = document.getElementById("empty-cart");
const checkoutBtn = document.getElementById("checkout-btn");

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

const toast = document.getElementById("toast");

let toastTimer;

// Save Cart
function saveCart() {
    localStorage.setItem("bookcart", JSON.stringify(cart));
}

// Format Price
function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

// Show Message
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

// ====================================
// DISPLAY BOOKS
// ====================================

function displayBooks(bookArray) {

    bookList.replaceChildren();

    document.getElementById("book-count").textContent =
        bookArray.length + " Books";

    bookArray.forEach(book => {

        const card = document.createElement("div");
        card.className = "book-card";

        const cover = document.createElement("div");
        cover.className = "book-cover " + book.cover;
        cover.textContent = book.icon;

        const title = document.createElement("h3");
        title.textContent = book.title;

        const author = document.createElement("p");
        author.className = "book-author";
        author.textContent = "By " + book.author;

        const bottom = document.createElement("div");
        bottom.className = "book-bottom";

        const price = document.createElement("span");
        price.className = "book-price";
        price.textContent = formatPrice(book.price);

        const button = document.createElement("button");
        button.className = "add-btn";
        button.textContent = "🛒 Add to Cart";
        button.addEventListener("click", () => {
            addToCart(book.id);
        });

        bottom.append(price, button);
        card.append(cover, title, author, bottom);

        bookList.appendChild(card);
    });

    document.getElementById("no-results").hidden =
        bookArray.length !== 0;
}

// ====================================
// ADD BOOK TO CART
// ====================================

function addToCart(bookId) {

    const existingItem = cart.find(
        item => item.id === bookId
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: bookId,
            quantity: 1
        });
    }

    saveCart();
    updateCart();

    const book = books.find(b => b.id === bookId);

    showToast(book.title + " added to cart!");
}

// ====================================
// UPDATE QUANTITY
// ====================================

function changeQuantity(bookId, change) {

    const item = cart.find(
        item => item.id === bookId
    );

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(
            item => item.id !== bookId
        );

        showToast("Book removed from cart!");
    }

    saveCart();
    updateCart();
}

// ====================================
// REMOVE BOOK FROM CART
// ====================================

function removeFromCart(bookId) {

    cart = cart.filter(
        item => item.id !== bookId
    );

    saveCart();
    updateCart();

    showToast("Book removed successfully!");
}

// ====================================
// DISPLAY CART
// ====================================

function updateCart() {

    cartItems.replaceChildren();

    let subtotal = 0;
    let totalQuantity = 0;

    cart.forEach(item => {

        const book = books.find(
            book => book.id === item.id
        );

        if (!book) return;

        const itemTotal = book.price * item.quantity;

        subtotal += itemTotal;
        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        const icon = document.createElement("div");
        icon.className = "cart-book-icon";
        icon.textContent = book.icon;

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const title = document.createElement("h4");
        title.textContent = book.title;

        const price = document.createElement("p");
        price.className = "cart-item-price";
        price.textContent = formatPrice(itemTotal);

        const controls = document.createElement("div");
        controls.className = "quantity-controls";

        const minus = document.createElement("button");
        minus.textContent = "−";
        minus.setAttribute("aria-label", "Decrease quantity");
        minus.addEventListener("click", () => {
            changeQuantity(book.id, -1);
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.setAttribute("aria-label", "Increase quantity");
        plus.addEventListener("click", () => {
            changeQuantity(book.id, 1);
        });

        const remove = document.createElement("button");
        remove.className = "remove-btn";
        remove.textContent = "Remove";
        remove.addEventListener("click", () => {
            removeFromCart(book.id);
        });

        controls.append(minus, quantity, plus);

        info.append(title, price, controls);

        cartItem.append(icon, info, remove);

        cartItems.appendChild(cartItem);
    });

    // Update Cart Counts
    cartCount.textContent = totalQuantity;

    cartItemsCount.textContent =
        totalQuantity + (totalQuantity === 1 ? " Item" : " Items");

    // Update Total Price
    subtotalElement.textContent = formatPrice(subtotal);
    totalElement.textContent = formatPrice(subtotal);

    // Empty Cart Message
    emptyCart.style.display =
        cart.length === 0 ? "block" : "none";

    // Checkout Button
    checkoutBtn.disabled = cart.length === 0;
}

// ====================================
// SEARCH BOOKS
// ====================================

function searchBooks() {

    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    const filteredBooks = books.filter(book =>

        book.title.toLowerCase().includes(searchText) ||

        book.author.toLowerCase().includes(searchText)
    );

    displayBooks(filteredBooks);
}

searchBtn.addEventListener("click", searchBooks);

searchInput.addEventListener("input", searchBooks);

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        searchBooks();
    }
});

// ====================================
// CHECKOUT DEMONSTRATION
// ====================================

checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) return;

    alert(
        "Thank you for shopping with BookCart!\n\n" +
        "Your cart total is " + totalElement.textContent +
        "\n\nThis is a demo cart. Payment and order placement " +
        "are not connected yet."
    );

});

// ====================================
// INITIALIZE WEBSITE
// ====================================

displayBooks(books);
updateCart();

console.log("BookCart Website Started Successfully!");
