// cart.js - Lógica do Carrinho Funcional com LocalStorage
document.addEventListener('DOMContentLoaded', () => {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartFloat = document.querySelector('.cart-float');
    const cartCountDisplay = document.querySelector('.cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const btnClearCart = document.getElementById('btn-clear-cart');
    const addCartBtns = document.querySelectorAll('.btn-add-cart');

    let cart = JSON.parse(localStorage.getItem('liraMedCart')) || [];

    function updateCartUI() {
        // Atualizar contador flutuante
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartCountDisplay.textContent = totalItems;
            cartCountDisplay.style.display = 'flex';
        } else {
            cartCountDisplay.style.display = 'none';
        }

        // Renderizar itens no sidebar
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Seu carrinho está vazio.</div>';
        } else {
            cart.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <div class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="btn-qty btn-decrease" data-id="${item.id}">-</button>
                            <span class="item-qty">${item.quantity}</span>
                            <button class="btn-qty btn-increase" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}" title="Remover"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }

        // Atualizar Total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalPrice.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

        // Salvar no localStorage
        localStorage.setItem('liraMedCart', JSON.stringify(cart));

        // Adicionar eventos de remover e alterar quantidade
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                removeFromCart(id);
            });
        });

        document.querySelectorAll('.btn-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                updateQuantity(id, -1);
            });
        });

        document.querySelectorAll('.btn-increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                updateQuantity(id, 1);
            });
        });
    }

    function updateQuantity(id, change) {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(id);
            } else {
                updateCartUI();
            }
        }
    }

    function addToCart(title, priceStr) {
        // Converter "R$ 1.299,90" para 1299.90
        const priceNum = parseFloat(priceStr.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
        const id = title.toLowerCase().replace(/\s+/g, '-');

        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: id,
                title: title,
                price: priceNum,
                quantity: 1
            });
        }
        updateCartUI();
        openCart();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    }

    function clearCart() {
        cart = [];
        updateCartUI();
    }

    function openCart() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('open');
    }

    function closeCart() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('open');
    }

    // Eventos de clique nos botões "Adicionar ao Carrinho"
    addCartBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            const title = productCard.querySelector('.product-title').textContent;
            const price = productCard.querySelector('.product-price').textContent;
            
            addToCart(title, price);

            // Feedback visual no botão
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Adicionado';
            this.style.backgroundColor = 'var(--secondary-green)';
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.backgroundColor = '';
            }, 2000);
        });
    });

    // Eventos da Sidebar
    if (cartFloat) {
        cartFloat.style.cursor = 'pointer';
        cartFloat.addEventListener('click', openCart);
    }
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    if (btnClearCart) btnClearCart.addEventListener('click', clearCart);

    // Inicialização da UI do carrinho (carregando do localStorage)
    updateCartUI();
});
