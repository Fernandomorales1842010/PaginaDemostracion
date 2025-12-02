import { products } from './data.js';
import { getCart, saveCart, updateCartCount } from './utils.js';

// --- ELEMENTOS DEL DOM ---
const viewer = document.getElementById('trophyViewer');
const cartSidebar = document.getElementById('cartSidebar');
const resLine1 = document.getElementById('resLine1');
const resLine2 = document.getElementById('resLine2');
const inputLine1 = document.getElementById('inputLine1');
const inputLine2 = document.getElementById('inputLine2');
const charCount1 = document.getElementById('charCount1');
const charCount2 = document.getElementById('charCount2');

// Variables de Estado
let currentProduct = null;
let currentFont = 'classic';
let cart = getCart();

// --- INICIALIZACIÓN ---
updateCartCount();

// 1. Cargar Producto desde URL
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));
currentProduct = products.find(p => p.id === productId);

if (currentProduct) {
    // Texto e Info
    document.getElementById('productTitle').innerText = currentProduct.name;
    document.querySelector('.card-price').innerText = 'Q' + currentProduct.price.toFixed(2);
    document.querySelector('.desc').innerText = currentProduct.description;
    if (currentProduct.isNew) document.getElementById('tagNew').style.display = 'inline-block';

    // Modelo 3D Inicial
    const defaultColor = currentProduct.colors[0];
    viewer.src = `${currentProduct.modelBase}_${defaultColor}.glb`;
    document.getElementById('colorName').innerText = defaultColor.toUpperCase();

    // Generar Botones de Color
    const colorContainer = document.querySelector('.color-options');
    const colorHexMap = { azul: '#0056b3', rojo: '#d32f2f', verde: '#2e7d32', naranja: '#ef6c00', dorado: '#d4af37', plateado: '#c0c0c0' };

    currentProduct.colors.forEach((color, index) => {
        const div = document.createElement('div');
        div.className = `swatch ${index === 0 ? 'active' : ''}`;
        div.style.backgroundColor = colorHexMap[color] || '#ccc';

        div.addEventListener('click', () => {
            // Actualizar UI activa
            document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
            div.classList.add('active');

            // Actualizar Nombre y Modelo
            document.getElementById('colorName').innerText = color.toUpperCase();
            viewer.src = `${currentProduct.modelBase}_${color}.glb`;
        });

        colorContainer.appendChild(div);
    });
} else {
    // Si no hay producto, volver al catálogo
    window.location.href = 'catalogo.html';
}

// --- 2. FUNCIONES GLOBALES (Window) ---

// Sincronizar Texto y Contadores
window.syncText = function () {
    const val1 = inputLine1.value;
    const val2 = inputLine2.value;

    // Actualizar Modelo
    resLine1.innerText = val1 || "CAMPEÓN";
    resLine2.innerText = val2 || "Tu Nombre";

    // Actualizar Contadores
    charCount1.innerText = `${val1.length}/20`;
    charCount2.innerText = `${val2.length}/25`;
};

// Cambiar Fuente
window.setFont = function (fontKey) {
    currentFont = fontKey;
    const fonts = {
        classic: "'Playfair Display', serif",
        modern: "'Poppins', sans-serif",
        script: "'Dancing Script', cursive"
    };

    // Aplicar al modelo
    resLine1.style.fontFamily = fonts[fontKey];
    resLine2.style.fontFamily = fonts[fontKey];

    // UI Botones
    document.querySelectorAll('.font-btn').forEach(btn => {
        btn.style.borderColor = "transparent";
        btn.style.backgroundColor = "#f5f5f7";
    });
    // Resaltar el seleccionado (truco simple)
    const activeBtn = event.target;
    activeBtn.style.borderColor = "#000";
    activeBtn.style.backgroundColor = "#fff";
};

// Carrito Sidebar
window.toggleCart = function (show) {
    if (show) {
        renderCartSidebar();
        cartSidebar.classList.add('active');
    } else {
        cartSidebar.classList.remove('active');
    }
};

// Renderizar Carrito Lateral
function renderCartSidebar() {
    const container = document.getElementById('cartItems');
    container.innerHTML = '';
    let total = 0;
    cart = getCart(); // Refrescar

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">Tu bolsa está vacía.</p>';
        document.getElementById('cartTotal').innerText = 'Q0.00';
        return;
    }

    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" style="width:60px; height:60px; object-fit:contain; background:#f9f9f9;">
            <div style="flex:1;">
                <h4 style="font-size:0.9rem; margin:0;">${item.name}</h4>
                <p style="font-size:0.75rem; color:#666; margin:0;">${item.color}</p>
                <span style="font-weight:700; font-size:0.9rem;">Q${item.price.toFixed(2)}</span>
            </div>
            <button onclick="removeSidebarItem(${index})" style="background:none; border:none; color:#ccc; cursor:pointer;">&times;</button>
        `;
        container.appendChild(div);
    });
    document.getElementById('cartTotal').innerText = 'Q' + total.toFixed(2);
}

// Añadir al Carrito
window.addToCart = function () {
    if (!currentProduct) return;

    const colorName = document.getElementById('colorName').innerText;
    const newItem = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        image: currentProduct.image,
        color: colorName,
        text: inputLine1.value || "Sin Grabado",
        font: currentFont
    };

    cart.push(newItem);
    saveCart(cart);
    updateCartCount();
    window.toggleCart(true); // Abrir carrito
};

// Eliminar item (Helper global)
window.removeSidebarItem = function (index) {
    cart.splice(index, 1);
    saveCart(cart);
    updateCartCount();
    renderCartSidebar();
};