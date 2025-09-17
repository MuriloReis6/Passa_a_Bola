// Loja JavaScript - Passa a Bola

document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeBtn = document.getElementById('closeBtn');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const fixedLogo = document.getElementById('fixedLogo');
    const productsGrid = document.getElementById('productsGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortSelect');
    const viewBtns = document.querySelectorAll('.view-btn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterInput = document.querySelector('.newsletter-input');
    const newsletterBtn = document.querySelector('.newsletter-btn');

    // Estado da aplicação
    let currentCategory = 'all';
    let currentSort = 'popular';
    let currentView = 'grid';
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Inicialização
    init();

    function init() {
        setupEventListeners();
        updateWishlistButtons();
        updateCartCount();
        filterProducts();
    }

    // Event Listeners
    function setupEventListeners() {
        // Menu Mobile
        hamburgerMenu?.addEventListener('click', toggleSidebar);
        closeBtn?.addEventListener('click', closeSidebar);
        sidebarOverlay?.addEventListener('click', closeSidebar);

        // Dropdown Mobile
        setupDropdownMobile();

        // Busca
        searchBtn?.addEventListener('click', toggleSearch);
        searchInput?.addEventListener('keypress', handleSearch);


        // Filtros
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => handleCategoryFilter(btn.dataset.category));
        });

        sortSelect?.addEventListener('change', handleSort);

        // Visualização
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => handleViewChange(btn.dataset.view));
        });

        // Modal
        modalClose?.addEventListener('click', closeModal);
        modalOverlay?.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        // Produtos
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => handleQuickView(e));
        });

        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', (e) => handleWishlist(e));
        });

        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => handleAddToCart(e));
        });

        // Newsletter
        newsletterForm?.addEventListener('submit', handleNewsletter);

        // Teclado
        document.addEventListener('keydown', handleKeydown);
    }

    // Menu Mobile
    function toggleSidebar() {
        sidebarMenu.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
        document.body.style.overflow = sidebarMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeSidebar() {
        sidebarMenu.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        hamburgerMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        // Fechar dropdown mobile quando fechar o menu lateral
        const dropdownMobile = document.querySelector('.dropdown-mobile');
        if (dropdownMobile) {
            dropdownMobile.classList.remove('active');
        }
    }

    // ===== FUNCIONALIDADES DO DROPDOWN MOBILE =====
    
    function setupDropdownMobile() {
        // Elementos do dropdown mobile
        const dropdownMobile = document.querySelector('.dropdown-mobile');
        const dropdownMobileTrigger = document.querySelector('.dropdown-mobile-trigger');

        // Toggle dropdown mobile
        function toggleDropdownMobile() {
            if (dropdownMobile) {
                dropdownMobile.classList.toggle('active');
            }
        }

        // Event listener do dropdown mobile
        if (dropdownMobileTrigger) {
            dropdownMobileTrigger.addEventListener('click', function(e) {
                e.preventDefault();
                toggleDropdownMobile();
            });
        }
    }

    // Busca
    function toggleSearch() {
        searchBox.classList.toggle('expanded');
        if (searchBox.classList.contains('expanded')) {
            searchInput.focus();
        }
    }

    function handleSearch(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.toLowerCase().trim();
            if (query) {
                searchProducts(query);
            }
        }
    }

    function searchProducts(query) {
        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            const title = product.querySelector('.product-title').textContent.toLowerCase();
            const category = product.querySelector('.product-category').textContent.toLowerCase();
            
            if (title.includes(query) || category.includes(query)) {
                product.style.display = 'block';
                product.style.animation = 'fadeInUp 0.6s ease-out';
            } else {
                product.style.display = 'none';
            }
        });
    }

    // Scroll do Header
    let lastScrollY = 0;
    let isScrolling = false;
    
    function handleScroll() {
        const scrollY = window.scrollY;
        const header = document.querySelector('.header');
        
        // Mostrar/ocultar logo fixa
        if (scrollY > 100) {
            fixedLogo.classList.add('visible');
        } else {
            fixedLogo.classList.remove('visible');
        }
        
        // Adicionar classe scrolled ao header
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Ocultar header ao rolar para baixo, mostrar ao rolar para cima
        if (scrollY > lastScrollY && scrollY > 200) {
            // Rolando para baixo
            header.classList.add('hidden');
        } else {
            // Rolando para cima
            header.classList.remove('hidden');
        }
        
        lastScrollY = scrollY;
    }
    
    // Debounce para melhor performance
    const debouncedScroll = debounce(handleScroll, 10);
    window.addEventListener('scroll', debouncedScroll);

    // Filtros
    function handleCategoryFilter(category) {
        currentCategory = category;
        
        // Atualizar botões ativos
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });

        filterProducts();
    }

    function handleSort() {
        currentSort = sortSelect.value;
        filterProducts();
    }

    function filterProducts() {
        const products = Array.from(document.querySelectorAll('.product-card'));
        
        // Filtrar por categoria
        let filteredProducts = products;
        if (currentCategory !== 'all') {
            filteredProducts = products.filter(product => 
                product.dataset.category === currentCategory
            );
        }

        // Ordenar produtos
        filteredProducts.sort((a, b) => {
            switch (currentSort) {
                case 'price-low':
                    return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                case 'price-high':
                    return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                case 'rating':
                    return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
                case 'newest':
                    return Math.random() - 0.5; // Simular produtos mais recentes
                default:
                    return 0;
            }
        });

        // Mostrar/ocultar produtos
        products.forEach(product => {
            if (filteredProducts.includes(product)) {
                product.style.display = 'block';
                product.style.animation = 'fadeInUp 0.6s ease-out';
            } else {
                product.style.display = 'none';
            }
        });
    }

    // Visualização
    function handleViewChange(view) {
        currentView = view;
        
        viewBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === view) {
                btn.classList.add('active');
            }
        });

        productsGrid.className = `products-grid ${view}-view`;
    }

    // Modal de Visualização Rápida
    function handleQuickView(e) {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        const productData = getProductData(productCard);
        showModal(productData);
    }

    function getProductData(productCard) {
        return {
            image: productCard.querySelector('.product-image img').src,
            category: productCard.querySelector('.product-category').textContent,
            title: productCard.querySelector('.product-title').textContent,
            rating: productCard.querySelector('.product-rating').innerHTML,
            price: productCard.querySelector('.current-price').textContent,
            description: 'Produto oficial do futebol feminino brasileiro. Qualidade premium e design exclusivo para os verdadeiros fãs do esporte.'
        };
    }

    function showModal(productData) {
        document.getElementById('modalImage').src = productData.image;
        document.getElementById('modalCategory').textContent = productData.category;
        document.getElementById('modalTitle').textContent = productData.title;
        document.getElementById('modalRating').innerHTML = productData.rating;
        document.getElementById('modalPrice').textContent = productData.price;
        document.getElementById('modalDescription').textContent = productData.description;
        
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Wishlist
    function handleWishlist(e) {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        const productId = productCard.dataset.productId || Math.random().toString(36).substr(2, 9);
        const productData = getProductData(productCard);
        
        const wishlistBtn = e.target.closest('.wishlist-btn');
        
        if (wishlist.includes(productId)) {
            // Remover da wishlist
            wishlist = wishlist.filter(id => id !== productId);
            wishlistBtn.classList.remove('active');
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
            showNotification('Produto removido dos favoritos', 'info');
        } else {
            // Adicionar à wishlist
            wishlist.push(productId);
            wishlistBtn.classList.add('active');
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
            showNotification('Produto adicionado aos favoritos', 'success');
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistButtons();
    }

    function updateWishlistButtons() {
        wishlistBtns.forEach(btn => {
            const productCard = btn.closest('.product-card');
            const productId = productCard.dataset.productId || Math.random().toString(36).substr(2, 9);
            
            if (wishlist.includes(productId)) {
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
    }

    // Carrinho
    function handleAddToCart(e) {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        const productData = getProductData(productCard);
        const productId = productCard.dataset.productId || Math.random().toString(36).substr(2, 9);
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                ...productData,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Produto adicionado ao carrinho!', 'success');
        
        // Animação do botão
        const btn = e.target.closest('.add-to-cart-btn');
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        // Aqui você pode atualizar um contador no header se existir
        console.log(`Carrinho: ${totalItems} itens`);
    }

    // Newsletter
    function handleNewsletter(e) {
        e.preventDefault();
        const email = newsletterInput.value.trim();
        
        if (!email || !isValidEmail(email)) {
            showNotification('Por favor, insira um e-mail válido', 'error');
            return;
        }
        
        // Simular envio
        newsletterBtn.textContent = 'Enviando...';
        newsletterBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('E-mail cadastrado com sucesso!', 'success');
            newsletterInput.value = '';
            newsletterBtn.textContent = 'Cadastrar';
            newsletterBtn.disabled = false;
        }, 2000);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notificações
    function showNotification(message, type = 'info') {
        // Remover notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            z-index: 3000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover após 4 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }

    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }

    function getNotificationColor(type) {
        switch (type) {
            case 'success': return '#10b981';
            case 'error': return '#ef4444';
            case 'warning': return '#f59e0b';
            default: return 'var(--cbf-blue)';
        }
    }

    // Teclado
    function handleKeydown(e) {
        if (e.key === 'Escape') {
            closeModal();
            closeSidebar();
        }
    }

    // Lazy Loading para imagens
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Animações de entrada
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.product-card, .hero-content, .filters-section');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out';
                    animationObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => animationObserver.observe(el));
    }

    // Inicializar funcionalidades adicionais
    initLazyLoading();
    initScrollAnimations();

    // Performance: Debounce para busca
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Aplicar debounce na busca
    const debouncedSearch = debounce((query) => {
        searchProducts(query);
    }, 300);

    searchInput?.addEventListener('input', (e) => {
        debouncedSearch(e.target.value.toLowerCase().trim());
    });

    // Exportar funções para uso global se necessário
    window.LojaApp = {
        addToCart: handleAddToCart,
        toggleWishlist: handleWishlist,
        showModal: showModal,
        closeModal: closeModal,
        filterProducts: filterProducts,
        searchProducts: searchProducts
    };
});
