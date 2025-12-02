// utils.js

// --- USUARIOS ---
export function loginUser(email, password) {
    if(email && password) {
        const name = email.split('@')[0];
        const user = { 
            name: name.charAt(0).toUpperCase() + name.slice(1), 
            email: email 
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}

export function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

export function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// --- CARRITO ---
export function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

export function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

export function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
}

export function updateCartCount() {
    const cart = getCart();
    const countElements = document.querySelectorAll('.cart-count');
    countElements.forEach(el => el.innerText = cart.length);
}

// --- PEDIDOS ---
export function saveOrder(orderData) {
    const allOrders = JSON.parse(localStorage.getItem('all_orders')) || [];
    const user = getCurrentUser();
    orderData.userEmail = user ? user.email : 'guest';
    allOrders.push(orderData);
    localStorage.setItem('all_orders', JSON.stringify(allOrders));
}

export function getOrders() {
    const user = getCurrentUser();
    const allOrders = JSON.parse(localStorage.getItem('all_orders')) || [];
    if (!user) return [];
    return allOrders.filter(order => order.userEmail === user.email);
}