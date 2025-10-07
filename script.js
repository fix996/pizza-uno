// Variables globales
let products = [];
let isAdmin = false;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Cargar productos desde localStorage
    loadProducts();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Mostrar productos en el menú
    displayMenuProducts();
}

function setupEventListeners() {
    // Menú toggle
    document.getElementById('menu-toggle').addEventListener('click', toggleMenu);
    
    // Navegación
    document.getElementById('login-link').addEventListener('click', toggleAdminLogin);
    
    // Formulario de login
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Panel de administración
    document.getElementById('add-product').addEventListener('click', openAddProductModal);
    document.getElementById('refresh-products').addEventListener('click', refreshProducts);
    document.getElementById('logout').addEventListener('click', handleLogout);
    
    // Modal de productos
    document.querySelector('.close').addEventListener('click', closeProductModal);
    document.getElementById('product-form').addEventListener('submit', saveProduct);
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('product-modal');
        if (event.target === modal) {
            closeProductModal();
        }
    });
    
    // Navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Cerrar menú móvil si está abierto
                    document.getElementById('main-nav').classList.remove('active');
                    document.getElementById('menu-toggle').classList.remove('active');
                    
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // CTA button
    document.querySelector('.cta-button').addEventListener('click', function() {
        document.getElementById('menu').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Funciones del menú toggle
function toggleMenu() {
    const nav = document.getElementById('main-nav');
    const toggle = document.getElementById('menu-toggle');
    
    nav.classList.toggle('active');
    toggle.classList.toggle('active');
}

// Funciones de administración
function toggleAdminLogin(e) {
    e.preventDefault();
    // Cerrar menú móvil si está abierto
    document.getElementById('main-nav').classList.remove('active');
    document.getElementById('menu-toggle').classList.remove('active');
    
    const adminSection = document.getElementById('admin');
    adminSection.scrollIntoView({ behavior: 'smooth' });
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // En una aplicación real, esto se haría con autenticación segura
    if (username === 'admin' && password === 'admin123') {
        isAdmin = true;
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        displayAdminProducts();
        alert('Inicio de sesión exitoso');
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}

function handleLogout() {
    isAdmin = false;
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    alert('Sesión cerrada correctamente');
}

function loadProducts() {
    // Cargar productos desde localStorage o usar datos predeterminados
    const savedProducts = localStorage.getItem('pizzaUnoProducts');
    
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Productos predeterminados con precios en formato argentino
        products = [
            { id: 1, name: 'Pizza Clásica', description: 'Mozzarella, tomate y albahaca fresca', price: 17000, category: 'pizzas' },
            { id: 2, name: 'Pizza Pepperoni', description: 'Doble pepperoni y queso mozzarella', price: 19000, category: 'pizzas' },
            { id: 3, name: 'Pizza Cuatro Quesos', description: 'Mezcla de quesos especiales de la casa', price: 18500, category: 'pizzas' },
            { id: 4, name: 'Pizza Especial', description: 'Jamón, morrones, huevo y aceitunas', price: 21000, category: 'pizzas' },
            { id: 5, name: 'Sandwich Italiano', description: 'Jamón, salami, pepperoni y vegetales', price: 8500, category: 'sandwiches' },
            { id: 6, name: 'Sandwich de Pollo', description: 'Pollo, aguacate y mayonesa especial', price: 9200, category: 'sandwiches' },
            { id: 7, name: 'Sandwich Vegetariano', description: 'Verduras frescas a la parrilla', price: 7800, category: 'sandwiches' },
            { id: 8, name: 'Bife de Chorizo', description: 'Con papas rústicas y vegetales', price: 18900, category: 'carnes' },
            { id: 9, name: 'Costillas BBQ', description: 'Nuestra salsa secreta de la casa', price: 16500, category: 'carnes' },
            { id: 10, name: 'Pollo a la Parrilla', description: 'Pollo marinado con hierbas', price: 14200, category: 'carnes' },
            { id: 11, name: 'Lomo Completo', description: 'Lomo, huevo, jamón y queso', price: 19800, category: 'carnes' }
        ];
        saveProducts();
    }
}

function saveProducts() {
    localStorage.setItem('pizzaUnoProducts', JSON.stringify(products));
}

function displayMenuProducts() {
    // Limpiar categorías existentes
    document.querySelectorAll('.menu-category').forEach(category => {
        category.innerHTML = '';
    });
    
    // Agrupar productos por categoría
    const categories = {
        pizzas: products.filter(p => p.category === 'pizzas'),
        sandwiches: products.filter(p => p.category === 'sandwiches'),
        carnes: products.filter(p => p.category === 'carnes')
    };
    
    // Mostrar productos en cada categoría
    for (const category in categories) {
        const categoryElement = document.getElementById(category);
        if (categoryElement) {
            categories[category].forEach(product => {
                categoryElement.appendChild(createMenuItem(product));
            });
        }
    }
}

function createMenuItem(product) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'menu-item';
    
    // Formatear precio en formato argentino
    const formattedPrice = new Intl.NumberFormat('es-AR').format(product.price);
    
    itemDiv.innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <span class="price">$${formattedPrice}</span>
    `;
    
    return itemDiv;
}

function displayAdminProducts() {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';
    
    if (products.length === 0) {
        productsList.innerHTML = '<p>No hay productos. Agrega el primero.</p>';
        return;
    }
    
    products.forEach(product => {
        // Formatear precio en formato argentino
        const formattedPrice = new Intl.NumberFormat('es-AR').format(product.price);
        
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <div class="product-info">
                <h4>${product.name}</h4>
                <p>${product.description} - $${formattedPrice}</p>
            </div>
            <div class="product-actions">
                <button class="edit-btn" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${product.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        productsList.appendChild(productItem);
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            deleteProduct(productId);
        });
    });
}

function refreshProducts() {
    displayAdminProducts();
}

function openAddProductModal() {
    if (!isAdmin) {
        alert('Debes iniciar sesión para agregar productos');
        return;
    }
    
    document.getElementById('modal-title').textContent = 'Agregar Producto';
    document.getElementById('product-id').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-category').value = 'pizzas';
    
    document.getElementById('product-modal').style.display = 'block';
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function saveProduct(e) {
    e.preventDefault();
    
    if (!isAdmin) {
        alert('No tienes permisos para realizar esta acción');
        return;
    }
    
    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = parseInt(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    
    if (productId) {
        // Editar producto existente
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            products[index] = {
                id: parseInt(productId),
                name,
                description,
                price,
                category
            };
        }
    } else {
        // Agregar nuevo producto
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({
            id: newId,
            name,
            description,
            price,
            category
        });
    }
    
    saveProducts();
    displayMenuProducts();
    displayAdminProducts();
    closeProductModal();
    
    alert('Producto guardado correctamente');
}

function editProduct(id) {
    if (!isAdmin) {
        alert('No tienes permisos para realizar esta acción');
        return;
    }
    
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('modal-title').textContent = 'Editar Producto';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
        
        document.getElementById('product-modal').style.display = 'block';
    }
}

function deleteProduct(id) {
    if (!isAdmin) {
        alert('No tienes permisos para realizar esta acción');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        displayMenuProducts();
        displayAdminProducts();
        alert('Producto eliminado correctamente');
    }
}