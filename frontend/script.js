// ==========================================
// CONFIGURATION
// ==========================================

//const API_URL = "http://localhost:5001/api";
const API_URL ="https://apna-bazaar-a5t6.onrender.com";

// ==========================================
// GLOBAL VARIABLES
// ==========================================

let allProducts = [];

let currentProducts = [];

let selectedCategory = "All";


// ==========================================
// DOM ELEMENTS
// ==========================================

const loginPage =
    document.getElementById("loginPage");

const mainWebsite =
    document.getElementById("mainWebsite");

const mobileStep =
    document.getElementById("mobileStep");

const otpStep =
    document.getElementById("otpStep");

const mobileInput =
    document.getElementById("mobile");

const otpInput =
    document.getElementById("otp");

const loginMessage =
    document.getElementById("loginMessage");

const sendOtpBtn =
    document.getElementById("sendOtpBtn");

const verifyOtpBtn =
    document.getElementById("verifyOtpBtn");

const skipLoginBtn =
    document.getElementById("skipLoginBtn");

const changeMobileBtn =
    document.getElementById("changeMobileBtn");


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        checkLogin();

        setupEvents();

    }
);


// ==========================================
// CHECK LOGIN
// ==========================================

function checkLogin() {

    const token =
        localStorage.getItem("token");

    const guest =
        localStorage.getItem("guest");

    if (token || guest === "true") {

        showWebsite();

    } else {

        showLogin();

    }
}


// ==========================================
// SHOW LOGIN
// ==========================================

function showLogin() {

    loginPage.classList.remove("hidden");

    mainWebsite.classList.add("hidden");

}


// ==========================================
// SHOW WEBSITE
// ==========================================

function showWebsite() {

    loginPage.classList.add("hidden");

    mainWebsite.classList.remove("hidden");

    showHome();

    loadProducts();

    updateCounts();

}


// ==========================================
// EVENT LISTENERS
// ==========================================

function setupEvents() {

    // SEND OTP

    sendOtpBtn.addEventListener(
        "click",
        sendOTP
    );


    // VERIFY OTP

    verifyOtpBtn.addEventListener(
        "click",
        verifyOTP
    );


    // SKIP LOGIN

    skipLoginBtn.addEventListener(
        "click",
        skipLogin
    );


    // CHANGE NUMBER

    changeMobileBtn.addEventListener(
        "click",
        changeMobile
    );


    // SEARCH

    document
        .getElementById("searchInput")
        .addEventListener(
            "input",
            searchProducts
        );


    // MOBILE INPUT

    mobileInput.addEventListener(
        "input",
        () => {

            mobileInput.value =
                mobileInput.value.replace(
                    /\D/g,
                    ""
                );

        }
    );


    // OTP INPUT

    otpInput.addEventListener(
        "input",
        () => {

            otpInput.value =
                otpInput.value.replace(
                    /\D/g,
                    ""
                );

        }
    );

}


// ==========================================
// SEND OTP
// ==========================================

async function sendOTP() {

    const mobile =
        mobileInput.value.trim();


    // Validation

    if (mobile.length !== 10) {

        showMessage(
            "Please enter a valid 10 digit mobile number"
        );

        return;

    }


    sendOtpBtn.disabled = true;

    sendOtpBtn.textContent =
        "Sending...";


    try {

        const response =
            await fetch(
                `${API_URL}/auth/send-otp`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        mobile
                    })
                }
            );


        const data =
            await response.json();


        if (data.success) {

            mobileStep.classList.add(
                "hidden"
            );

            otpStep.classList.remove(
                "hidden"
            );

            showMessage(
                "OTP generated. Check backend terminal.",
                true
            );

            otpInput.focus();

        } else {

            showMessage(
                data.message
            );

        }

    } catch (error) {

        console.error(error);

        showMessage(
            "Cannot connect to backend. Is the server running?"
        );

    }


    sendOtpBtn.disabled = false;

    sendOtpBtn.textContent =
        "Get OTP";

}


// ==========================================
// VERIFY OTP
// ==========================================

async function verifyOTP() {

    const mobile =
        mobileInput.value.trim();

    const otp =
        otpInput.value.trim();


    if (otp.length !== 6) {

        showMessage(
            "Please enter the 6 digit OTP"
        );

        return;

    }


    verifyOtpBtn.disabled = true;

    verifyOtpBtn.textContent =
        "Logging in...";


    try {

        const response =
            await fetch(
                `${API_URL}/auth/verify-otp`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        mobile,
                        otp
                    })
                }
            );


        const data =
            await response.json();


        if (data.success) {

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            localStorage.removeItem(
                "guest"
            );


            showToast(
                "Login successful!"
            );


            showWebsite();

        } else {

            showMessage(
                data.message
            );

        }

    } catch (error) {

        console.error(error);

        showMessage(
            "Something went wrong"
        );

    }


    verifyOtpBtn.disabled = false;

    verifyOtpBtn.textContent =
        "Login";

}


// ==========================================
// SKIP LOGIN
// ==========================================

function skipLogin() {

    localStorage.setItem(
        "guest",
        "true"
    );

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "user"
    );

    showToast(
        "Continuing as guest"
    );

    showWebsite();

}


// ==========================================
// CHANGE MOBILE
// ==========================================

function changeMobile() {

    otpStep.classList.add(
        "hidden"
    );

    mobileStep.classList.remove(
        "hidden"
    );

    otpInput.value = "";

    clearMessage();

    mobileInput.focus();

}


// ==========================================
// LOGIN MESSAGE
// ==========================================

function showMessage(
    message,
    success = false
) {

    loginMessage.textContent =
        message;

    loginMessage.style.color =
        success
            ? "#16a34a"
            : "#e74c3c";

}


function clearMessage() {

    loginMessage.textContent = "";

}


// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {

    const productsGrid =
        document.getElementById(
            "productsGrid"
        );


    productsGrid.innerHTML = `
        <div class="loading">
            Loading products...
        </div>
    `;


    try {

        const response =
            await fetch(
                `${API_URL}/products`
            );


        const data =
            await response.json();


        if (data.success) {

            allProducts =
                data.products;

            currentProducts =
                [...allProducts];

            displayProducts(
                currentProducts
            );

        } else {

            productsGrid.innerHTML = `
                <div class="no-products">
                    Unable to load products.
                </div>
            `;

        }

    } catch (error) {

        console.error(error);

        productsGrid.innerHTML = `
            <div class="no-products">
                <h3>Backend not connected</h3>
                <p>
                    Please start the Node.js server.
                </p>
            </div>
        `;

    }

}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(
    products
) {

    const grid =
        document.getElementById(
            "productsGrid"
        );


    if (!products.length) {

        grid.innerHTML = `
            <div class="no-products">
                <h3>No products found</h3>
                <p>
                    Try another search.
                </p>
            </div>
        `;

        return;

    }


    grid.innerHTML =
        products
            .map(
                (product) =>
                    createProductHTML(
                        product
                    )
            )
            .join("");

}


// ==========================================
// CREATE PRODUCT HTML
// ==========================================

function createProductHTML(
    product
) {

    const wishlist =
        getWishlist();


    const isWishlisted =
        wishlist.some(
            item =>
                item._id === product._id
        );


    return `
        <div class="product-card">

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    onerror="this.src='https://via.placeholder.com/500x500?text=Product'"
                >

                <button
                    class="wishlist-btn"
                    onclick="toggleWishlist('${product._id}')"
                >
                    ${
                        isWishlisted
                            ? "❤️"
                            : "🤍"
                    }
                </button>

            </div>

            <div class="product-details">

                <h3>
                    ${product.name}
                </h3>

                <p class="product-category">
                    ${product.category}
                </p>

                <div class="rating">
                    ⭐ ${product.rating || 4.5}
                </div>

                <div class="price">
                    ₹${Number(product.price).toLocaleString("en-IN")}
                </div>

                <button
                    class="add-cart-btn"
                    onclick="addToCart('${product._id}')"
                >
                    🛒 Add to Cart
                </button>

            </div>

        </div>
    `;

}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(productId) {

    const product =
        allProducts.find(
            item =>
                item._id === productId
        );


    if (!product) {
        return;
    }


    let cart =
        getCart();


    const existing =
        cart.find(
            item =>
                item._id === productId
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    saveCart(cart);

    updateCounts();

    showToast(
        `${product.name} added to cart`
    );

}


// ==========================================
// GET CART
// ==========================================

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "cart"
            )
        ) || [];

    } catch {

        return [];

    }

}


// ==========================================
// SAVE CART
// ==========================================

function saveCart(cart) {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// ==========================================
// SHOW CART
// ==========================================

function showCart() {

    hideAllSections();

    document
        .getElementById(
            "cartSection"
        )
        .classList.remove(
            "hidden"
        );


    renderCart();

}


// ==========================================
// RENDER CART
// ==========================================

function renderCart() {

    const container =
        document.getElementById(
            "cartContent"
        );


    const cart =
        getCart();


    if (!cart.length) {

        container.innerHTML = `
            <div class="empty-cart">

                <div>
                    🛒
                </div>

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Add some products to get started.
                </p>

                <br>

                <button
                    class="shop-btn"
                    onclick="showHome()"
                >
                    Start Shopping
                </button>

            </div>
        `;

        return;

    }


    let total = 0;

    let itemsCount = 0;


    cart.forEach(
        item => {

            total +=
                item.price *
                item.quantity;

            itemsCount +=
                item.quantity;

        }
    );


    const delivery =
        total >= 1000
            ? 0
            : 49;


    const grandTotal =
        total + delivery;


    container.innerHTML = `

        <div class="cart-items">

            ${cart.map(
                (item, index) => `

                <div class="cart-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                    <div class="cart-item-info">

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            ${item.category}
                        </p>

                        <div class="cart-item-price">
                            ₹${Number(item.price).toLocaleString("en-IN")}
                        </div>

                        <div class="quantity">

                            <button
                                onclick="changeQuantity(${index}, -1)"
                            >
                                −
                            </button>

                            <strong>
                                ${item.quantity}
                            </strong>

                            <button
                                onclick="changeQuantity(${index}, 1)"
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${index})"
                    >
                        Remove
                    </button>

                </div>

            `
            ).join("")}

        </div>


        <div class="cart-summary">

            <h2>
                Price Details
            </h2>

            <div class="summary-row">

                <span>
                    Items (${itemsCount})
                </span>

                <span>
                    ₹${total.toLocaleString("en-IN")}
                </span>

            </div>

            <div class="summary-row">

                <span>
                    Delivery
                </span>

                <span>
                    ${
                        delivery === 0
                            ? "FREE"
                            : "₹49"
                    }
                </span>

            </div>

            <div class="summary-row total-row">

                <span>
                    Total
                </span>

                <span>
                    ₹${grandTotal.toLocaleString("en-IN")}
                </span>

            </div>

            <button
                class="checkout-btn"
                onclick="checkout()"
            >
                Proceed to Checkout
            </button>

        </div>
    `;

}


// ==========================================
// CHANGE QUANTITY
// ==========================================

function changeQuantity(
    index,
    change
) {

    const cart =
        getCart();


    cart[index].quantity +=
        change;


    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(
            index,
            1
        );

    }


    saveCart(cart);

    updateCounts();

    renderCart();

}


// ==========================================
// REMOVE FROM CART
// ==========================================

function removeFromCart(index) {

    const cart =
        getCart();


    cart.splice(
        index,
        1
    );


    saveCart(cart);

    updateCounts();

    renderCart();

    showToast(
        "Product removed"
    );

}


// ==========================================
// WISHLIST
// ==========================================

function getWishlist() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "wishlist"
            )
        ) || [];

    } catch {

        return [];

    }

}


function saveWishlist(
    wishlist
) {

    localStorage.setItem(
        "wishlist",
        JSON.stringify(
            wishlist
        )
    );

}


// ==========================================
// TOGGLE WISHLIST
// ==========================================

function toggleWishlist(
    productId
) {

    const product =
        allProducts.find(
            item =>
                item._id === productId
        );


    if (!product) {
        return;
    }


    let wishlist =
        getWishlist();


    const index =
        wishlist.findIndex(
            item =>
                item._id === productId
        );


    if (index === -1) {

        wishlist.push(
            product
        );

        showToast(
            "Added to wishlist ❤️"
        );

    } else {

        wishlist.splice(
            index,
            1
        );

        showToast(
            "Removed from wishlist"
        );

    }


    saveWishlist(
        wishlist
    );

    updateCounts();

    displayProducts(
        currentProducts
    );

}


// ==========================================
// SHOW WISHLIST
// ==========================================

function showWishlist() {

    hideAllSections();

    document
        .getElementById(
            "wishlistSection"
        )
        .classList.remove(
            "hidden"
        );


    renderWishlist();

}


// ==========================================
// RENDER WISHLIST
// ==========================================

function renderWishlist() {

    const container =
        document.getElementById(
            "wishlistContent"
        );


    const wishlist =
        getWishlist();


    if (!wishlist.length) {

        container.innerHTML = `
            <div class="no-products">

                <h2>
                    ❤️ Your wishlist is empty
                </h2>

                <p>
                    Add products you love to your wishlist.
                </p>

            </div>
        `;

        return;

    }


    container.innerHTML =
        wishlist
            .map(
                product =>
                    createProductHTML(
                        product
                    )
            )
            .join("");

}


// ==========================================
// SEARCH
// ==========================================

function searchProducts() {

    const search =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase()
            .trim();


    currentProducts =
        allProducts.filter(
            product => {

                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(search) ||

                    product.category
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =
                    selectedCategory ===
                        "All" ||

                    product.category ===
                        selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    displayProducts(
        currentProducts
    );

}


// ==========================================
// CATEGORY FILTER
// ==========================================

function filterCategory(
    category
) {

    selectedCategory =
        category;


    document
        .querySelectorAll(
            ".category-btn"
        )
        .forEach(
            btn => {

                btn.classList.remove(
                    "active"
                );

            }
        );


    event
        .currentTarget
        .classList.add(
            "active"
        );


    searchProducts();

}


// ==========================================
// SORT
// ==========================================

function sortProducts() {

    const sort =
        document
            .getElementById(
                "sortSelect"
            )
            .value;


    if (sort === "low") {

        currentProducts.sort(
            (a, b) =>
                a.price - b.price
        );

    } else if (
        sort === "high"
    ) {

        currentProducts.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    displayProducts(
        currentProducts
    );

}


// ==========================================
// UPDATE COUNTS
// ==========================================

function updateCounts() {

    const cart =
        getCart();

    const wishlist =
        getWishlist();


    const cartCount =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    document
        .getElementById(
            "cartCount"
        )
        .textContent =
        cartCount;


    document
        .getElementById(
            "wishlistCount"
        )
        .textContent =
        wishlist.length;


    document
        .getElementById(
            "profileWishlist"
        )
        .textContent =
        wishlist.length;

}


// ==========================================
// SHOW HOME
// ==========================================

function showHome() {

    hideAllSections();

    document
        .getElementById(
            "homeSection"
        )
        .classList.remove(
            "hidden"
        );

}


// ==========================================
// SHOW PROFILE
// ==========================================

function showProfile() {

    hideAllSections();

    document
        .getElementById(
            "profileSection"
        )
        .classList.remove(
            "hidden"
        );


    const user =
        JSON.parse(
            localStorage.getItem(
                "user"
            )
        );


    const guest =
        localStorage.getItem(
            "guest"
        );


    if (user) {

        document
            .getElementById(
                "profileName"
            )
            .textContent =
            user.name || "User";


        document
            .getElementById(
                "profileMobile"
            )
            .textContent =
            "+91 " +
            user.mobile;


        document
            .getElementById(
                "accountType"
            )
            .textContent =
            "Registered";

    } else {

        document
            .getElementById(
                "profileName"
            )
            .textContent =
            "Guest User";


        document
            .getElementById(
                "profileMobile"
            )
            .textContent =
            "Login to see your account";


        document
            .getElementById(
                "accountType"
            )
            .textContent =
            "Guest";

    }

}


// ==========================================
// HIDE ALL SECTIONS
// ==========================================

function hideAllSections() {

    document
        .getElementById(
            "homeSection"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "cartSection"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "wishlistSection"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "profileSection"
        )
        .classList.add(
            "hidden"
        );

}


// ==========================================
// SCROLL TO PRODUCTS
// ==========================================

function scrollToProducts() {

    showHome();


    setTimeout(
        () => {

            document
                .getElementById(
                    "productsSection"
                )
                .scrollIntoView({
                    behavior: "smooth"
                });

        },
        100
    );

}


// ==========================================
// CHECKOUT
// ==========================================

function checkout() {

    const guest =
        localStorage.getItem(
            "guest"
        );


    const token =
        localStorage.getItem(
            "token"
        );


    if (!token && guest) {

        const login =
            confirm(
                "Please login with your mobile number before checkout.\n\nDo you want to login now?"
            );


        if (login) {

            logout();

        }

        return;

    }


    alert(
        "Checkout system will be connected here.\n\nNext step: Address + Payment + Order creation."
    );

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "user"
    );

    localStorage.removeItem(
        "guest"
    );


    showLogin();

    mobileInput.value = "";

    otpInput.value = "";

    otpStep.classList.add(
        "hidden"
    );

    mobileStep.classList.remove(
        "hidden"
    );

    clearMessage();

}


// ==========================================
// TOAST
// ==========================================

function showToast(
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}
