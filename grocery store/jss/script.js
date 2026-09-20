const header = document.querySelector('.header');
const searchForm = document.querySelector('#search-form');
const cart = document.querySelector('#shopping-cart');
const loginForm = document.querySelector('#login-form');
const navbar = document.querySelector('.navbar');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartCount = document.querySelector('.cart-count');
const products = document.querySelectorAll('.product-card');
const filters = document.querySelectorAll('.filter');
const toast = document.querySelector('.toast');
const basket = [];
let toastTimer;

function closePanels() {
    searchForm.classList.remove('active');
    cart.classList.remove('active');
    loginForm.classList.remove('active');
}

document.querySelector('#search-btn').addEventListener('click', () => {
    const wasOpen = searchForm.classList.contains('active');
    closePanels();
    searchForm.classList.toggle('active', !wasOpen);
    if (!wasOpen) document.querySelector('#search-box').focus();
});

document.querySelector('#cart-btn').addEventListener('click', () => {
    const wasOpen = cart.classList.contains('active');
    closePanels();
    cart.classList.toggle('active', !wasOpen);
});

document.querySelector('#login-btn').addEventListener('click', () => {
    const wasOpen = loginForm.classList.contains('active');
    closePanels();
    loginForm.classList.toggle('active', !wasOpen);
});

document.querySelector('#menu-btn').addEventListener('click', () => {
    navbar.classList.toggle('active');
});

document.querySelector('.close-panel').addEventListener('click', () => cart.classList.remove('active'));

document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) closePanels();
});

function renderCart() {
    if (!basket.length) {
        cartItems.innerHTML = '<p class="empty-cart">Your basket is waiting for something delicious.</p>';
    } else {
        cartItems.innerHTML = basket.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div><h3>${item.name}</h3><p>$${item.price.toFixed(2)} <button data-index="${index}" class="remove-item">Remove</button></p></div>
            </div>`).join('');
    }
    const total = basket.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = basket.length;
    cartItems.querySelectorAll('.remove-item').forEach((button) => {
        button.addEventListener('click', () => {
            basket.splice(Number(button.dataset.index), 1);
            renderCart();
        });
    });
}

function showToast() {
    clearTimeout(toastTimer);
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

products.forEach((product) => {
    product.querySelector('.quick-add').addEventListener('click', () => {
        basket.push({
            name: product.dataset.name,
            price: Number(product.dataset.price),
            image: product.querySelector('img').getAttribute('src')
        });
        renderCart();
        cart.classList.add('active');
        showToast();
    });
});

filters.forEach((filter) => {
    filter.addEventListener('click', () => {
        filters.forEach((button) => button.classList.remove('active'));
        filter.classList.add('active');
        const selectedCategory = filter.dataset.filter;
        products.forEach((product) => {
            product.hidden = selectedCategory !== 'all' && product.dataset.category !== selectedCategory;
        });
    });
});

document.querySelector('#search-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const query = document.querySelector('#search-box').value.trim().toLowerCase();
    products.forEach((product) => {
        product.hidden = query && !product.dataset.name.includes(query);
    });
    filters.forEach((filter) => filter.classList.toggle('active', filter.dataset.filter === 'all'));
    searchForm.classList.remove('active');
    document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    event.currentTarget.querySelector('.btn').textContent = 'You are signed in';
});

document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (basket.length) alert('Thanks! Checkout is ready for the next step.');
});

renderCart();
