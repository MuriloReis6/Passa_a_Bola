// Funcionalidades da página de notícias
document.addEventListener('DOMContentLoaded', function () {

    // Elementos do DOM
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeMenu = document.getElementById('closeMenu');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const fixedLogo = document.getElementById('fixedLogo');
    const header = document.querySelector('.header');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsCards = document.querySelectorAll('.news-card');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const newsletterForm = document.querySelector('.newsletter-form');

    // Variáveis de controle
    let currentFilter = 'todas';
    let visibleCards = 8; // Número inicial de cards visíveis
    let allCards = Array.from(newsCards);
    let isMenuOpen = false;
    let isSearchExpanded = false;

    // ===== FUNCIONALIDADES DO HEADER =====

    // Menu hambúrguer
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            sidebarMenu.classList.add('active');
            sidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            sidebarMenu.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Fechar menu
    function closeMenuHandler() {
        isMenuOpen = false;
        sidebarMenu.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners do menu
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleMenu);
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', closeMenuHandler);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMenuHandler);
    }

    // Dropdown mobile no sidebar
    const dropdownMobileTriggers = document.querySelectorAll('.dropdown-mobile-trigger');
    dropdownMobileTriggers.forEach(trigger => {
        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            const dropdown = this.closest('.dropdown-mobile');
            dropdown.classList.toggle('active');
        });
    });

    // ===== FUNCIONALIDADES DE BUSCA =====

    // Expandir/contrair busca
    function toggleSearch() {
        isSearchExpanded = !isSearchExpanded;

        if (isSearchExpanded) {
            searchBox.classList.add('expanded');
            searchInput.focus();
        } else {
            searchBox.classList.remove('expanded');
            searchInput.blur();
            searchInput.value = '';
        }
    }

    // Event listeners da busca
    if (searchBtn) {
        searchBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (isSearchExpanded && searchInput.value.trim()) {
                performSearch(searchInput.value.trim());
            } else {
                toggleSearch();
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this.value.trim()) {
                    performSearch(this.value.trim());
                }
            }
        });

        // Fechar busca ao clicar fora
        searchInput.addEventListener('blur', function () {
            setTimeout(() => {
                if (!this.value.trim()) {
                    isSearchExpanded = false;
                    searchBox.classList.remove('expanded');
                }
            }, 200);
        });
    }

    // Função de busca
    function performSearch(query) {
        console.log('Buscando por:', query);

        // Simular busca (em uma aplicação real, isso seria uma requisição AJAX)
        const results = allCards.filter(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();
            const category = card.querySelector('.news-category').textContent.toLowerCase();

            return title.includes(query.toLowerCase()) ||
                content.includes(query.toLowerCase()) ||
                category.includes(query.toLowerCase());
        });

        // Mostrar resultados
        showSearchResults(results, query);
    }

    // Mostrar resultados da busca
    function showSearchResults(results, query) {
        // Ocultar todos os cards
        allCards.forEach(card => {
            card.style.display = 'none';
        });

        // Mostrar apenas os resultados
        results.forEach(card => {
            card.style.display = 'block';
        });

        // Atualizar título da seção
        const sectionTitle = document.querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.textContent = `Resultados para "${query}" (${results.length})`;
        }

        // Scroll para a seção de notícias
        document.querySelector('.news-grid-section').scrollIntoView({
            behavior: 'smooth'
        });
    }

    // ===== FUNCIONALIDADES DE FILTROS =====

    // Aplicar filtro
    function applyFilter(category) {
        currentFilter = category;

        // Atualizar botões ativos
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });

        // Filtrar cards
        allCards.forEach((card, index) => {
            const cardCategory = card.dataset.category;
            const shouldShow = category === 'todas' || cardCategory === category;

            if (shouldShow) {
                card.classList.remove('hidden');
                card.style.display = 'block';
                // Animação de entrada
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });

        // Atualizar título da seção
        const sectionTitle = document.querySelector('.section-title');
        if (sectionTitle) {
            const categoryNames = {
                'todas': 'Todas as Notícias',
                'selecao': 'Seleção Brasileira',
                'brasileirao': 'Brasileirão Feminino',
                'internacional': 'Futebol Internacional',
                'tecnologia': 'Tecnologia',
                'mercado': 'Mercado da Bola'
            };
            sectionTitle.textContent = categoryNames[category] || 'Notícias';
        }

        // Resetar contador de cards visíveis
        visibleCards = 8;
        updateLoadMoreButton();
    }

    // Event listeners dos filtros
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const category = this.dataset.category;
            applyFilter(category);
        });
    });

    // ===== FUNCIONALIDADES DE CARREGAR MAIS =====

    // Atualizar botão "Carregar Mais"
    function updateLoadMoreButton() {
        const visibleCardsCount = allCards.filter(card =>
            !card.classList.contains('hidden') &&
            card.style.display !== 'none'
        ).length;

        if (visibleCardsCount <= visibleCards) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }

    // Carregar mais notícias
    function loadMoreNews() {
        const visibleCardsArray = allCards.filter(card =>
            !card.classList.contains('hidden') &&
            card.style.display !== 'none'
        );

        const nextBatch = visibleCardsArray.slice(visibleCards, visibleCards + 4);

        nextBatch.forEach((card, index) => {
            setTimeout(() => {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });

        visibleCards += 4;
        updateLoadMoreButton();
    }

    // Event listener do botão carregar mais
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            this.classList.add('loading');

            setTimeout(() => {
                loadMoreNews();
                this.classList.remove('loading');
            }, 500);
        });
    }

    // ===== FUNCIONALIDADES DE SCROLL =====

    // Logo fixa ao rolar
    function handleScroll() {
        const scrollY = window.scrollY;

        // Mostrar/ocultar logo fixa
        if (scrollY > 200) {
            fixedLogo.classList.add('visible');
        } else {
            fixedLogo.classList.remove('visible');
        }

        // Ocultar header ao rolar para baixo
        if (scrollY > 100) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }

        // Mostrar botão "voltar ao topo"
        if (scrollY > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    }

    // Event listener do scroll
    window.addEventListener('scroll', handleScroll);

    // Voltar ao topo
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== FUNCIONALIDADES DE NEWSLETTER =====

    // Enviar newsletter
    function handleNewsletterSubmit(e) {
        e.preventDefault();

        const email = e.target.querySelector('input[type="email"]').value;

        if (!email) {
            showNotification('Por favor, insira um e-mail válido.', 'error');
            return;
        }

        // Simular envio (em uma aplicação real, seria uma requisição AJAX)
        const submitBtn = e.target.querySelector('button');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification('Inscrição realizada com sucesso! 🎉', 'success');
            e.target.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    // Event listener da newsletter
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    // ===== FUNCIONALIDADES DE NOTIFICAÇÃO =====

    // Mostrar notificação
    function showNotification(message, type = 'info') {
        // Remover notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Criar nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
        `;

        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Adicionar ao DOM
        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Event listener para fechar
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });

        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }

    // ===== FUNCIONALIDADES DE ANIMAÇÃO =====

    // Intersection Observer para animações
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.news-card, .featured-main, .newsletter-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ===== FUNCIONALIDADES DE ACESSIBILIDADE =====

    // Navegação por teclado
    document.addEventListener('keydown', function (e) {
        // ESC para fechar menu
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenuHandler();
        }

        // ESC para fechar busca
        if (e.key === 'Escape' && isSearchExpanded) {
            isSearchExpanded = false;
            searchBox.classList.remove('expanded');
            searchInput.value = '';
        }
    });

    // Foco visível para elementos interativos
    const focusableElements = document.querySelectorAll('button, a, input, [tabindex]');
    focusableElements.forEach(el => {
        el.addEventListener('focus', function () {
            this.style.outline = '2px solid var(--cbf-yellow)';
            this.style.outlineOffset = '2px';
        });

        el.addEventListener('blur', function () {
            this.style.outline = 'none';
        });
    });

    // ===== INICIALIZAÇÃO =====

    // Configurar estado inicial
    function initializePage() {
        // Ocultar cards extras inicialmente
        allCards.forEach((card, index) => {
            if (index >= visibleCards) {
                card.style.display = 'none';
            }
        });

        // Configurar botão "voltar ao topo"
        if (backToTopBtn) {
            backToTopBtn.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: var(--cbf-blue);
                color: white;
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(153, 42, 187, 0.3);
            `;
        }

        // Atualizar botão carregar mais
        updateLoadMoreButton();

        // Aplicar filtro inicial
        applyFilter('todas');
    }

    // Inicializar página
    initializePage();

    // ===== FUNCIONALIDADES DE PERFORMANCE =====

    // Lazy loading para imagens
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Debounce para busca
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
    const debouncedSearch = debounce(performSearch, 300);

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            if (this.value.trim().length > 2) {
                debouncedSearch(this.value.trim());
            }
        });
    }

    console.log('Página de notícias carregada com sucesso! 🚀');
});
