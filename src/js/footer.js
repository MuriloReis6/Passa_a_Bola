/**
 * Footer JavaScript - Passa a Bola
 * Funcionalidades para o footer do site
 */

class FooterManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupNewsletterForm();
    this.setupBackToTopButton();
    this.setupSmoothScrolling();
    this.setupFooterAnimations();
    this.setupAccessibility();
  }

  /**
   * Configura o formulário de newsletter
   */
  setupNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('newsletterEmail');
    const messageDiv = document.getElementById('newsletterMessage');
    const submitBtn = form?.querySelector('.newsletter-btn');

    if (!form || !emailInput || !messageDiv || !submitBtn) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = emailInput.value.trim();
      
      if (!this.validateEmail(email)) {
        this.showMessage(messageDiv, 'Por favor, insira um e-mail válido.', 'error');
        return;
      }

      // Mostrar estado de loading
      this.setLoadingState(submitBtn, true);
      
      try {
        // Simular envio (substituir por API real)
        await this.submitNewsletter(email);
        this.showMessage(messageDiv, 'Obrigada! Você foi inscrita com sucesso! 🎉', 'success');
        emailInput.value = '';
      } catch (error) {
        this.showMessage(messageDiv, 'Ops! Algo deu errado. Tente novamente.', 'error');
        console.error('Erro ao inscrever newsletter:', error);
      } finally {
        this.setLoadingState(submitBtn, false);
      }
    });

    // Limpar mensagem quando usuário digitar
    emailInput.addEventListener('input', () => {
      if (messageDiv.textContent) {
        this.clearMessage(messageDiv);
      }
    });
  }

  /**
   * Valida formato de e-mail
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Simula envio do newsletter (substituir por API real)
   */
  async submitNewsletter(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular sucesso 90% das vezes
        if (Math.random() > 0.1) {
          resolve({ success: true, email });
        } else {
          reject(new Error('Erro simulado'));
        }
      }, 1500);
    });
  }

  /**
   * Mostra mensagem de feedback
   */
  showMessage(element, message, type) {
    element.textContent = message;
    element.className = `newsletter-message ${type}`;
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
      this.clearMessage(element);
    }, 5000);
  }

  /**
   * Limpa mensagem
   */
  clearMessage(element) {
    element.textContent = '';
    element.className = 'newsletter-message';
  }

  /**
   * Define estado de loading do botão
   */
  setLoadingState(button, isLoading) {
    if (isLoading) {
      button.classList.add('loading');
      button.disabled = true;
    } else {
      button.classList.remove('loading');
      button.disabled = false;
    }
  }

  /**
   * Configura botão "Voltar ao topo"
   */
  setupBackToTopButton() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    if (!backToTopBtn) return;

    // Mostrar/esconder botão baseado no scroll
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
        backToTopBtn.style.transform = 'translateY(0)';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
        backToTopBtn.style.transform = 'translateY(10px)';
      }
    });

    // Scroll suave ao clicar
    backToTopBtn.addEventListener('click', () => {
      this.scrollToTop();
    });

    // Inicializar estado do botão
    backToTopBtn.style.transition = 'all 0.3s ease';
    backToTopBtn.style.opacity = '0';
    backToTopBtn.style.visibility = 'hidden';
    backToTopBtn.style.transform = 'translateY(10px)';
  }

  /**
   * Scroll suave para o topo
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Configura scroll suave para links internos
   */
  setupSmoothScrolling() {
    const footerLinks = document.querySelectorAll('.footer-link[href^="#"]');
    
    footerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        if (href === '#') return;
        
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
          e.preventDefault();
          
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Configura animações do footer
   */
  setupFooterAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observar elementos do footer
    const footerElements = document.querySelectorAll('.footer-brand, .footer-links, .footer-newsletter, .footer-bottom');
    footerElements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * Configura melhorias de acessibilidade
   */
  setupAccessibility() {
    // Adicionar aria-labels para links sem texto
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
      if (!link.getAttribute('aria-label')) {
        const text = link.textContent.trim();
        link.setAttribute('aria-label', text);
      }
    });

    // Melhorar navegação por teclado
    const focusableElements = document.querySelectorAll('.footer a, .footer button, .footer input');
    focusableElements.forEach(element => {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (element.tagName === 'A' || element.tagName === 'BUTTON') {
            e.preventDefault();
            element.click();
          }
        }
      });
    });

    // Adicionar indicadores visuais para foco
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  /**
   * Método para atualizar estatísticas do footer (se necessário)
   */
  updateFooterStats() {
    // Exemplo: atualizar contadores de usuários, jogos, etc.
    const statsElements = document.querySelectorAll('[data-stat]');
    
    statsElements.forEach(element => {
      const statType = element.getAttribute('data-stat');
      const currentValue = parseInt(element.textContent) || 0;
      
      // Animar contador
      this.animateCounter(element, currentValue, currentValue + Math.floor(Math.random() * 100));
    });
  }

  /**
   * Anima contador numérico
   */
  animateCounter(element, start, end, duration = 2000) {
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = Math.floor(start + (end - start) * this.easeOutQuart(progress));
      element.textContent = current.toLocaleString('pt-BR');
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  }

  /**
   * Função de easing
   */
  easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  /**
   * Método para lidar com mudanças de tema
   */
  handleThemeChange(theme) {
    const footer = document.querySelector('.footer');
    
    if (theme === 'dark') {
      footer.classList.add('dark-theme');
    } else {
      footer.classList.remove('dark-theme');
    }
  }

  /**
   * Método para lidar com mudanças de idioma
   */
  handleLanguageChange(language) {
    // Atualizar textos do footer baseado no idioma
    const translations = {
      'pt-BR': {
        newsletterTitle: 'Fique por dentro das novidades!',
        newsletterDescription: 'Receba as últimas notícias do futebol feminino diretamente no seu e-mail.',
        newsletterPlaceholder: 'Seu melhor e-mail',
        newsletterButton: 'Inscrever',
        copyright: 'Todos os direitos reservados.',
        motto: 'Conectando o futebol feminino brasileiro'
      },
      'en-US': {
        newsletterTitle: 'Stay updated with the latest news!',
        newsletterDescription: 'Receive the latest women\'s football news directly in your email.',
        newsletterPlaceholder: 'Your best email',
        newsletterButton: 'Subscribe',
        copyright: 'All rights reserved.',
        motto: 'Connecting Brazilian women\'s football'
      }
    };

    const texts = translations[language] || translations['pt-BR'];
    
    // Atualizar elementos
    const titleElement = document.querySelector('.newsletter-title');
    const descElement = document.querySelector('.newsletter-description');
    const inputElement = document.querySelector('.newsletter-input');
    const buttonElement = document.querySelector('.newsletter-btn .btn-text');
    
    if (titleElement) titleElement.textContent = texts.newsletterTitle;
    if (descElement) descElement.textContent = texts.newsletterDescription;
    if (inputElement) inputElement.placeholder = texts.newsletterPlaceholder;
    if (buttonElement) buttonElement.textContent = texts.newsletterButton;
  }

  /**
   * Método para limpar recursos
   */
  destroy() {
    // Remover event listeners e limpar recursos
    const form = document.getElementById('newsletterForm');
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    if (form) {
      form.removeEventListener('submit', this.handleNewsletterSubmit);
    }
    
    if (backToTopBtn) {
      backToTopBtn.removeEventListener('click', this.scrollToTop);
    }
    
    window.removeEventListener('scroll', this.handleScroll);
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Verificar se estamos em uma página que tem footer
  if (document.querySelector('.footer')) {
    window.footerManager = new FooterManager();
  }
});

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FooterManager;
}
