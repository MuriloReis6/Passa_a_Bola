// Login Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    const userTypeInput = document.getElementById('userType');
    const userTypeButtons = document.querySelectorAll('.user-type-btn');

    // Elementos do header
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const closeMenu = document.getElementById('closeMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const fixedLogo = document.getElementById('fixedLogo');

    // Variáveis de estado
    let isPasswordVisible = false;
    let isFormSubmitting = false;

    // Inicialização
    init();

    function init() {
        setupEventListeners();
        setupHeaderFunctionality();
        setupFormValidation();
        setupPasswordToggle();
        setupUserTypeSelection();
        setupSocialLogin();
        setupScrollEffects();
    }

    // Event Listeners
    function setupEventListeners() {
        // Formulário de login
        if (loginForm) {
            loginForm.addEventListener('submit', handleLoginSubmit);
        }

        // Validação em tempo real
        if (emailInput) {
            emailInput.addEventListener('blur', validateEmail);
            emailInput.addEventListener('input', clearFieldError);
        }

        if (passwordInput) {
            passwordInput.addEventListener('blur', validatePassword);
            passwordInput.addEventListener('input', clearFieldError);
        }

        // Botão de mostrar/ocultar senha
        if (passwordToggle) {
            passwordToggle.addEventListener('click', togglePasswordVisibility);
        }
    }

    // Funcionalidades do Header
    function setupHeaderFunctionality() {
        // Menu hambúrguer
        if (hamburgerMenu) {
            hamburgerMenu.addEventListener('click', toggleSidebar);
        }

        if (closeMenu) {
            closeMenu.addEventListener('click', closeSidebar);
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', closeSidebar);
        }

        // Barra de busca
        if (searchBox && searchInput && searchBtn) {
            searchBtn.addEventListener('click', toggleSearch);
            searchBox.addEventListener('click', expandSearch);

            // Fechar busca ao clicar fora
            document.addEventListener('click', function (e) {
                if (!searchBox.contains(e.target) && searchBox.classList.contains('expanded')) {
                    closeSearch();
                }
            });
        }
    }

    // Funções de validação (definidas no escopo global)
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            showFieldError(emailInput, 'E-mail é obrigatório');
            return false;
        } else if (!emailRegex.test(email)) {
            showFieldError(emailInput, 'E-mail inválido');
            return false;
        } else {
            showFieldSuccess(emailInput);
            return true;
        }
    }

    function validatePassword() {
        const password = passwordInput.value;

        if (!password) {
            showFieldError(passwordInput, 'Senha é obrigatória');
            return false;
        } else if (password.length < 6) {
            showFieldError(passwordInput, 'Senha deve ter pelo menos 6 caracteres');
            return false;
        } else {
            showFieldSuccess(passwordInput);
            return true;
        }
    }

    // Validação do Formulário
    function setupFormValidation() {
        // Funções de validação globais
        window.validateEmail = validateEmail;
        window.validatePassword = validatePassword;
    }

    // Função de toggle de visibilidade da senha (definida no escopo global)
    function togglePasswordVisibility() {
        isPasswordVisible = !isPasswordVisible;

        if (isPasswordVisible) {
            passwordInput.type = 'text';
            passwordToggle.classList.add('active');
            passwordToggle.innerHTML = `
                <svg class="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
            `;
        } else {
            passwordInput.type = 'password';
            passwordToggle.classList.remove('active');
            passwordToggle.innerHTML = `
                <svg class="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
            `;
        }
    }

    // Toggle de visibilidade da senha
    function setupPasswordToggle() {
        window.togglePasswordVisibility = togglePasswordVisibility;
    }

    // Seleção de Tipo de Usuário
    function setupUserTypeSelection() {
        if (userTypeButtons.length === 0) {
            console.error('Nenhum botão de tipo de usuário encontrado!');
            return;
        }

        userTypeButtons.forEach(button => {
            button.addEventListener('click', function () {
                const selectedType = this.dataset.type;

                // Remover classe active de todos os botões
                userTypeButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.style.transform = '';
                    // Limpar estilos inline
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                    btn.style.color = '';
                });

                // Adicionar classe active ao botão clicado
                this.classList.add('active');

                // Aplicar estilo inline como backup
                this.style.backgroundColor = 'rgb(153, 42, 187)';
                this.style.borderColor = 'rgb(153, 42, 187)';
                this.style.color = 'white';

                // Atualizar o campo hidden
                userTypeInput.value = selectedType;

                // Adicionar feedback visual
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);

                console.log('Tipo de usuário selecionado:', selectedType);
            });
        });
    }

    // Login Social
    function setupSocialLogin() {
        const googleBtn = document.querySelector('.google-btn');
        const facebookBtn = document.querySelector('.facebook-btn');

        if (googleBtn) {
            googleBtn.addEventListener('click', function (e) {
                e.preventDefault();
                handleSocialLogin('google');
            });
        }

        if (facebookBtn) {
            facebookBtn.addEventListener('click', function (e) {
                e.preventDefault();
                handleSocialLogin('facebook');
            });
        }
    }

    // Efeitos de Scroll
    function setupScrollEffects() {
        let lastScrollTop = 0;
        const header = document.querySelector('.header');

        window.addEventListener('scroll', function () {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Mostrar/ocultar header
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }

            // Logo fixa
            if (scrollTop > 200) {
                fixedLogo.classList.add('visible');
            } else {
                fixedLogo.classList.remove('visible');
            }

            lastScrollTop = scrollTop;
        });
    }

    // Handlers de Eventos
    function handleLoginSubmit(e) {
        e.preventDefault();

        if (isFormSubmitting) return;

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberMeCheckbox.checked;
        const userType = userTypeInput.value;

        // Validação
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (!isEmailValid || !isPasswordValid) {
            showNotification('Por favor, corrija os erros no formulário', 'error');
            return;
        }

        if (!userType) {
            showNotification('Por favor, selecione se você é Jogador ou Olheiro', 'error');
            return;
        }

        // Simular envio
        setFormSubmitting(true);

        // Simular delay de rede
        setTimeout(() => {
            // Aqui você faria a requisição real para o servidor
            console.log('Dados do login:', { email, password, rememberMe, userType });

            // Simular sucesso
            showNotification('Login realizado com sucesso!', 'success');

            // Salvar dados do usuário no localStorage
            const userData = {
                name: email.split('@')[0], // Usar parte do email como nome temporário
                email: email,
                userType: userType,
                loginTime: new Date().toISOString(),
                isLoggedIn: true
            };
            
            localStorage.setItem('userData', JSON.stringify(userData));

            // Redirecionar para página de perfil após sucesso
            setTimeout(() => {
                window.location.href = 'perfil.html';
            }, 1500);

            setFormSubmitting(false);
        }, 2000);
    }

    function handleSocialLogin(provider) {
        showNotification(`Redirecionando para login com ${provider}...`, 'info');

        // Aqui você implementaria a integração real com Google/Facebook
        setTimeout(() => {
            showNotification(`Login com ${provider} não implementado ainda`, 'warning');
        }, 1000);
    }

    // Funções de UI
    function toggleSidebar() {
        sidebarMenu.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        document.body.style.overflow = sidebarMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeSidebar() {
        sidebarMenu.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function toggleSearch() {
        if (searchBox.classList.contains('expanded')) {
            closeSearch();
        } else {
            expandSearch();
        }
    }

    function expandSearch() {
        searchBox.classList.add('expanded');
        setTimeout(() => {
            searchInput.focus();
        }, 100);
    }

    function closeSearch() {
        searchBox.classList.remove('expanded');
        searchInput.value = '';
    }

    function setFormSubmitting(submitting) {
        isFormSubmitting = submitting;

        if (submitting) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'block';
            loginSubmitBtn.disabled = true;
        } else {
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            loginSubmitBtn.disabled = false;
        }
    }

    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('success');
        formGroup.classList.add('error');

        // Remover mensagem anterior
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Adicionar nova mensagem
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            ${message}
        `;
        formGroup.appendChild(errorDiv);
    }

    function showFieldSuccess(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        formGroup.classList.add('success');

        // Remover mensagem de erro
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    function clearFieldError(e) {
        const field = e.target;
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');

        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    function showNotification(message, type = 'info') {
        // Remover notificação anterior
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Criar nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <svg class="notification-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    ${getNotificationIcon(type)}
                </svg>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
        `;

        // Adicionar estilos inline para a notificação
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    function getNotificationIcon(type) {
        const icons = {
            success: '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>',
            error: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
            warning: '<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>',
            info: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>'
        };
        return icons[type] || icons.info;
    }

    function getNotificationColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #10b981, #059669)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
            info: 'linear-gradient(135deg, #3b82f6, #2563eb)'
        };
        return colors[type] || colors.info;
    }

    // Adicionar estilos CSS para animações
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-icon {
            flex-shrink: 0;
        }
        
        .notification-message {
            flex: 1;
            font-weight: 500;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
        }
        
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    document.head.appendChild(style);

    // Funções globais para uso externo
    window.validateEmail = validateEmail;
    window.validatePassword = validatePassword;
});
