// Verificar status de login e atualizar header
function checkLoginStatus() {
    const userData = localStorage.getItem('userData');
    const loginBtn = document.getElementById('loginBtn');
    
    if (userData && loginBtn) {
        const parsedData = JSON.parse(userData);
        
        // Atualizar botão de login para mostrar perfil
        loginBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span class="login-text">${parsedData.name}</span>
        `;
        
        // Alterar link para perfil
        loginBtn.onclick = function() {
            window.location.href = 'src/html/perfil.html';
        };
        
        // Adicionar classe para indicar que está logado
        loginBtn.classList.add('logged-in');
    }
}

// Carrossel de Notícias - CBF Style
class NewsCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 segundos
        this.isTransitioning = false;

        this.init();
    }

    init() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.carousel = document.querySelector('.hero-carousel');

        this.totalSlides = this.slides.length;

        if (this.totalSlides === 0) {
            console.error('Nenhum slide encontrado');
            return;
        }

        this.bindEvents();
        this.startAutoPlay();
        this.updateNavigation();
        this.preloadImages();
    }

    bindEvents() {
        // Botões de navegação
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            } else if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoPlay();
            }
        });

        // Touch events para mobile
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        this.carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY);
        }, { passive: true });

        // Pausar autoplay no hover
        this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.resumeAutoPlay());

        // Pausar autoplay no foco dos controles
        this.prevBtn.addEventListener('focus', () => this.pauseAutoPlay());
        this.nextBtn.addEventListener('focus', () => this.pauseAutoPlay());
        this.indicators.forEach(indicator => {
            indicator.addEventListener('focus', () => this.pauseAutoPlay());
        });

        // Resumir autoplay quando perder foco
        this.prevBtn.addEventListener('blur', () => this.resumeAutoPlay());
        this.nextBtn.addEventListener('blur', () => this.resumeAutoPlay());
        this.indicators.forEach(indicator => {
            indicator.addEventListener('blur', () => this.resumeAutoPlay());
        });
    }

    handleSwipe(startX, startY, endX, endY) {
        const diffX = startX - endX;
        const diffY = startY - endY;
        const minSwipeDistance = 50;

        // Verificar se é um swipe horizontal válido
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
                // Swipe para esquerda - próximo slide
                this.nextSlide();
            } else {
                // Swipe para direita - slide anterior
                this.prevSlide();
            }
        }
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide || index < 0 || index >= this.totalSlides) {
            return;
        }

        this.isTransitioning = true;

        // Remover classe active do slide atual
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');

        // Atualizar slide atual
        this.currentSlide = index;

        // Adicionar classe active ao novo slide
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');

        // Atualizar navegação
        this.updateNavigation();

        // Resetar autoplay
        this.resetAutoPlay();

        // Permitir transições após um delay
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800);
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.goToSlide(prevIndex);
    }

    updateNavigation() {
        // Atualizar estado dos botões
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;

        // Atualizar estilos dos botões
        if (this.prevBtn.disabled) {
            this.prevBtn.style.opacity = '0.5';
            this.prevBtn.style.cursor = 'not-allowed';
        } else {
            this.prevBtn.style.opacity = '1';
            this.prevBtn.style.cursor = 'pointer';
        }

        if (this.nextBtn.disabled) {
            this.nextBtn.style.opacity = '0.5';
            this.nextBtn.style.cursor = 'not-allowed';
        } else {
            this.nextBtn.style.opacity = '1';
            this.nextBtn.style.cursor = 'pointer';
        }

        // Atualizar indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    startAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }

        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resumeAutoPlay() {
        if (!this.autoPlayInterval) {
            this.startAutoPlay();
        }
    }

    resetAutoPlay() {
        this.pauseAutoPlay();
        this.startAutoPlay();
    }

    toggleAutoPlay() {
        if (this.autoPlayInterval) {
            this.pauseAutoPlay();
        } else {
            this.resumeAutoPlay();
        }
    }

    preloadImages() {
        // Pré-carregar imagens para melhor performance
        this.slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img && img.src) {
                const preloadImg = new Image();
                preloadImg.src = img.src;
            }
        });
    }

    // Método para adicionar novos slides dinamicamente
    addSlide(imageSrc, category, title, subtitle, date, readTime) {
        const slideIndex = this.totalSlides;

        // Criar elemento do slide
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.setAttribute('data-slide', slideIndex);

        slide.innerHTML = `
            <div class="slide-background">
                <img src="${imageSrc}" alt="${title}">
            </div>
            <div class="slide-content">
                <div class="slide-category">${category}</div>
                <h2 class="slide-title">${title}</h2>
                <p class="slide-subtitle">${subtitle}</p>
                <div class="slide-meta">
                    <span class="slide-date">${date}</span>
                    <span class="slide-read-time">${readTime}</span>
                </div>
            </div>
        `;

        // Adicionar slide ao container
        const container = document.querySelector('.carousel-container');
        container.appendChild(slide);

        // Criar indicador
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        indicator.setAttribute('data-slide', slideIndex);
        indicator.addEventListener('click', () => this.goToSlide(slideIndex));

        const indicatorsContainer = document.getElementById('indicators');
        indicatorsContainer.appendChild(indicator);

        // Atualizar contadores
        this.totalSlides++;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');

        // Atualizar navegação
        this.updateNavigation();
    }

    // Método para remover slide
    removeSlide(index) {
        if (index < 0 || index >= this.totalSlides || this.totalSlides <= 1) {
            return;
        }

        // Remover slide
        this.slides[index].remove();

        // Remover indicador
        this.indicators[index].remove();

        // Atualizar contadores
        this.totalSlides--;

        // Ajustar índices dos slides restantes
        for (let i = index; i < this.totalSlides; i++) {
            this.slides[i].setAttribute('data-slide', i);
            this.indicators[i].setAttribute('data-slide', i);
        }

        // Se o slide removido era o atual, ir para o primeiro
        if (index === this.currentSlide) {
            this.currentSlide = 0;
        } else if (index < this.currentSlide) {
            this.currentSlide--;
        }

        // Atualizar navegação
        this.updateNavigation();

        // Atualizar referências
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
    }

    // Método para configurar delay do autoplay
    setAutoPlayDelay(delay) {
        this.autoPlayDelay = delay;
        this.resetAutoPlay();
    }

    // Método para obter informações do slide atual
    getCurrentSlideInfo() {
        const currentSlide = this.slides[this.currentSlide];
        return {
            index: this.currentSlide,
            total: this.totalSlides,
            title: currentSlide.querySelector('.slide-title').textContent,
            category: currentSlide.querySelector('.slide-category').textContent,
            subtitle: currentSlide.querySelector('.slide-subtitle').textContent
        };
    }
}

// Inicializar carrossel quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Criar instância do carrossel
    const carousel = new NewsCarousel();

    // Menu Hambúrguer / Sidebar
    const hamburgerMenuButton = document.getElementById('hamburgerMenu');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const closeMenuButton = document.getElementById('closeMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    const openSidebarMenu = () => {
        if (!sidebarMenu || !sidebarOverlay) return;
        sidebarMenu.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeSidebarMenu = () => {
        if (!sidebarMenu || !sidebarOverlay) return;
        sidebarMenu.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Fechar dropdown mobile quando fechar o menu lateral
        const dropdownMobile = document.querySelector('.dropdown-mobile');
        if (dropdownMobile) {
            dropdownMobile.classList.remove('active');
        }
    };

    const toggleSidebarMenu = () => {
        if (!sidebarMenu || !sidebarOverlay) return;
        const isOpen = sidebarMenu.classList.contains('active');
        if (isOpen) {
            closeSidebarMenu();
        } else {
            openSidebarMenu();
        }
    };

    if (hamburgerMenuButton) {
        hamburgerMenuButton.addEventListener('click', toggleSidebarMenu);
        hamburgerMenuButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSidebarMenu();
            }
        });
    }

    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', closeSidebarMenu);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebarMenu);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebarMenu();
        }
    });

    // ===== FUNCIONALIDADES DO DROPDOWN MOBILE =====
    
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

    // Exemplo de como adicionar um novo slide dinamicamente
    // carousel.addSlide(
    //     'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop',
    //     'Novidade',
    //     'Novo slide adicionado dinamicamente',
    //     'Este slide foi criado via JavaScript',
    //     '16 Janeiro 2024',
    //     '2 min leitura'
    // );

    // Exemplo de como alterar o delay do autoplay
    // carousel.setAutoPlayDelay(3000); // 3 segundos

    // Exemplo de como pausar/resumir o autoplay
    // carousel.pauseAutoPlay();
    // carousel.resumeAutoPlay();

    // Exemplo de como obter informações do slide atual
    // console.log(carousel.getCurrentSlideInfo());

    // Adicionar carrossel ao escopo global para debugging
    window.newsCarousel = carousel;

    // Controle de header e logo fixa ao rolar
    const header = document.querySelector('.header');
    const fixedLogo = document.getElementById('fixedLogo');
    let lastScrollY = window.scrollY;
    let isHeaderHidden = false;

    const updateHeaderOnScroll = () => {
        const currentY = window.scrollY;
        const threshold = 60; // distância para começar a esconder

        if (currentY > threshold && currentY > lastScrollY) {
            // rolando para baixo
            if (!isHeaderHidden) {
                header && header.classList.add('hidden');
                fixedLogo && fixedLogo.classList.add('visible');
                isHeaderHidden = true;
            }
        } else if (currentY < lastScrollY || currentY <= threshold) {
            // rolando para cima ou acima do topo
            if (isHeaderHidden) {
                header && header.classList.remove('hidden');
                fixedLogo && fixedLogo.classList.remove('visible');
                isHeaderHidden = false;
            }
        }
        lastScrollY = currentY;
    };

    window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });

    // Funcionalidade da barra de busca expansível
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchBox && searchInput && searchBtn) {
        let isExpanded = false;

        const expandSearch = () => {
            if (!isExpanded) {
                searchBox.classList.add('expanded');
                searchInput.focus();
                isExpanded = true;
            }
        };

        const collapseSearch = () => {
            if (isExpanded && !searchInput.value.trim()) {
                searchBox.classList.remove('expanded');
                isExpanded = false;
            }
        };

        // Expandir ao clicar na lupa ou na caixa
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            expandSearch();
        });

        searchBox.addEventListener('click', (e) => {
            if (e.target === searchBox) {
                expandSearch();
            }
        });

        // Colapsar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!searchBox.contains(e.target)) {
                collapseSearch();
            }
        });

        // Colapsar ao pressionar Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                collapseSearch();
                searchInput.blur();
            }
        });

        // Manter expandido se houver texto
        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim()) {
                isExpanded = true;
            }
        });

        // Colapsar quando o input perder o foco e estiver vazio
        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                if (!searchInput.value.trim()) {
                    collapseSearch();
                }
            }, 100);
        });
    }
});

// Adicionar funcionalidades extras quando a página estiver totalmente carregada
window.addEventListener('load', () => {
    // Verificar status de login
    checkLoginStatus();
    
    // Adicionar classe loaded para animações de entrada
    document.body.classList.add('loaded');

    // Adicionar efeito de parallax sutil
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const slides = document.querySelectorAll('.carousel-slide.active .slide-background img');

        slides.forEach(img => {
            const speed = 0.5;
            img.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Adicionar suporte para preferências de movimento reduzido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition-duration', '0.1s');
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
    }
});

// Adicionar suporte para Service Worker (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}


