// Perfil.js - Funcionalidades da página de perfil
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeMenu = document.getElementById('closeMenu');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const fixedLogo = document.getElementById('fixedLogo');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileMenu = document.getElementById('profileMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Elementos de navegação do perfil
    const profileNavItems = document.querySelectorAll('.profile-nav-item');
    const profileSections = document.querySelectorAll('.profile-section');
    
    // Elementos de edição
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const cancelEdit = document.getElementById('cancelEdit');
    const saveEdit = document.getElementById('saveEdit');
    const editProfileForm = document.getElementById('editProfileForm');
    
    // Elementos de vídeo
    const addVideoBtn = document.getElementById('addVideoBtn');
    const videoItems = document.querySelectorAll('.video-item');
    const playBtns = document.querySelectorAll('.play-btn');
    
    // Elementos de estatísticas
    const statsFilter = document.getElementById('statsFilter');
    
    // Dados do usuário (simulados - em produção viriam de uma API)
    let userData = {
        name: 'Amanda Guterres',
        role: 'Jogadora • Atacante',
        age: 22,
        position: 'Atacante',
        team: 'Palmeiras',
        city: 'São Paulo, SP',
        bio: 'Olá! Sou Amanda Guterres, uma apaixonada pelo futebol feminino desde os 8 anos de idade. Comecei minha jornada no futebol jogando nas categorias de base do São Paulo FC, onde desenvolvi minha paixão pelo esporte e minha técnica como atacante.',
        stats: {
            goals: 47,
            assists: 23,
            games: 89,
            minutes: 7234
        },
        videos: [
            {
                id: 1,
                title: 'Gol de falta incrível!',
                description: 'Final do Campeonato Paulista 2023',
                thumbnail: '../../assets/imgs/AMANDA-11.png',
                duration: '2:34',
                views: '1.2k',
                date: 'há 2 dias'
            },
            {
                id: 2,
                title: 'Treino técnico - Finalização',
                description: 'Exercícios de finalização no treino',
                thumbnail: '../../assets/imgs/AMANDA-GUTIERRES-5.png',
                duration: '4:12',
                views: '856',
                date: 'há 1 semana'
            },
            {
                id: 3,
                title: 'Bastidores do vestiário',
                description: 'Momento de descontração com as companheiras',
                thumbnail: '../../assets/imgs/BRENA-3.png',
                duration: '3:45',
                views: '2.1k',
                date: 'há 2 semanas'
            },
            {
                id: 4,
                title: 'Drible e gol!',
                description: 'Jogada individual que resultou em gol',
                thumbnail: '../../assets/imgs/BRUNA-HIRATA-3.png',
                duration: '1:58',
                views: '3.4k',
                date: 'há 3 semanas'
            }
        ]
    };

    // Inicialização
    init();

    function init() {
        setupEventListeners();
        loadUserData();
        setupProfileNavigation();
        setupVideoPlayers();
        setupStatsFilter();
        setupScrollEffects();
    }

    // Event Listeners
    function setupEventListeners() {
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
        if (searchBtn) {
            searchBtn.addEventListener('click', toggleSearch);
        }

        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
        }

        // Dropdown do perfil
        if (profileDropdown) {
            profileDropdown.addEventListener('mouseenter', showProfileMenu);
            profileDropdown.addEventListener('mouseleave', hideProfileMenu);
        }

        // Logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }

        // Modal de edição
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', openEditModal);
        }

        if (closeEditModal) {
            closeEditModal.addEventListener('click', closeEditModal);
        }

        if (cancelEdit) {
            cancelEdit.addEventListener('click', closeEditModal);
        }

        if (saveEdit) {
            saveEdit.addEventListener('click', saveProfileChanges);
        }

        // Adicionar vídeo
        if (addVideoBtn) {
            addVideoBtn.addEventListener('click', addNewVideo);
        }

        // Filtro de estatísticas
        if (statsFilter) {
            statsFilter.addEventListener('change', filterStats);
        }

        // Fechar modal ao clicar fora
        if (editProfileModal) {
            editProfileModal.addEventListener('click', function(e) {
                if (e.target === editProfileModal) {
                    closeEditModal();
                }
            });
        }

        // Teclas de atalho
        document.addEventListener('keydown', handleKeyboard);
    }

    // Menu Sidebar
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

    // Barra de Busca
    function toggleSearch() {
        searchBox.classList.toggle('expanded');
        if (searchBox.classList.contains('expanded')) {
            searchInput.focus();
        }
    }

    function handleSearch(e) {
        const query = e.target.value.toLowerCase();
        if (query.length > 2) {
            // Implementar busca
            console.log('Buscando por:', query);
        }
    }

    // Profile Menu
    function showProfileMenu() {
        profileMenu.style.opacity = '1';
        profileMenu.style.visibility = 'visible';
        profileMenu.style.transform = 'translateY(0)';
    }

    function hideProfileMenu() {
        profileMenu.style.opacity = '0';
        profileMenu.style.visibility = 'hidden';
        profileMenu.style.transform = 'translateY(-10px)';
    }

    // Logout
    function handleLogout() {
        if (confirm('Tem certeza que deseja sair?')) {
            // Limpar dados do usuário
            localStorage.removeItem('userData');
            sessionStorage.clear();
            
            // Redirecionar para login
            window.location.href = 'login.html';
        }
    }

    // Carregar dados do usuário
    function loadUserData() {
        // Verificar se o usuário está logado
        const storedUserData = localStorage.getItem('userData');
        
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            
            // Atualizar dados do usuário com informações do login
            userData.name = parsedUserData.name || userData.name;
            userData.email = parsedUserData.email;
            userData.userType = parsedUserData.userType;
            
            // Ajustar role baseado no tipo de usuário
            if (parsedUserData.userType === 'olheiro') {
                userData.role = 'Olheiro • Observador de Talentos';
                userData.position = 'Olheiro';
            } else {
                userData.role = 'Jogadora • Atacante';
                userData.position = 'Atacante';
            }
            
            console.log('Dados do usuário carregados:', userData);
        } else {
            // Se não há dados de login, redirecionar para login
            console.log('Usuário não logado, redirecionando para login...');
            window.location.href = 'login.html';
            return;
        }
        
        updateProfileDisplay();
    }

    function updateProfileDisplay() {
        // Atualizar nome no header
        const profileNameElements = document.querySelectorAll('#profileName, #profileNameLarge');
        profileNameElements.forEach(el => {
            if (el) el.textContent = userData.name;
        });

        // Atualizar role
        const profileRole = document.getElementById('profileRole');
        if (profileRole) {
            profileRole.textContent = userData.role;
        }

        // Atualizar estatísticas
        updateStatsDisplay();
    }

    function updateStatsDisplay() {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 3) {
            statNumbers[0].textContent = userData.age;
            statNumbers[1].textContent = '5'; // Anos de carreira
            statNumbers[2].textContent = userData.stats.goals;
        }
    }

    // Navegação do Perfil
    function setupProfileNavigation() {
        profileNavItems.forEach(item => {
            item.addEventListener('click', function() {
                const targetSection = this.getAttribute('data-section');
                switchProfileSection(targetSection);
            });
        });
    }

    function switchProfileSection(sectionId) {
        // Remover active de todos os itens
        profileNavItems.forEach(item => item.classList.remove('active'));
        profileSections.forEach(section => section.classList.remove('active'));

        // Adicionar active ao item clicado
        const activeItem = document.querySelector(`[data-section="${sectionId}"]`);
        const activeSection = document.getElementById(sectionId);

        if (activeItem) activeItem.classList.add('active');
        if (activeSection) activeSection.classList.add('active');

        // Scroll suave para o topo da seção
        if (activeSection) {
            activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Modal de Edição
    function openEditModal() {
        // Preencher formulário com dados atuais
        document.getElementById('editName').value = userData.name;
        document.getElementById('editPosition').value = userData.position.toLowerCase();
        document.getElementById('editAge').value = userData.age;
        document.getElementById('editTeam').value = userData.team;
        document.getElementById('editCity').value = userData.city;
        document.getElementById('editBio').value = userData.bio;

        editProfileModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeEditModal() {
        editProfileModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function saveProfileChanges() {
        // Validar formulário
        if (!validateEditForm()) {
            return;
        }

        // Coletar dados do formulário
        const formData = {
            name: document.getElementById('editName').value,
            position: document.getElementById('editPosition').value,
            age: parseInt(document.getElementById('editAge').value),
            team: document.getElementById('editTeam').value,
            city: document.getElementById('editCity').value,
            bio: document.getElementById('editBio').value
        };

        // Atualizar dados do usuário
        userData = { ...userData, ...formData };
        userData.role = `${formData.position.charAt(0).toUpperCase() + formData.position.slice(1)} • ${getPositionDisplayName(formData.position)}`;

        // Atualizar display
        updateProfileDisplay();

        // Fechar modal
        closeEditModal();

        // Mostrar feedback
        showNotification('Perfil atualizado com sucesso!', 'success');

        // Em produção, enviar para API
        console.log('Dados salvos:', userData);
    }

    function validateEditForm() {
        const name = document.getElementById('editName').value.trim();
        const age = parseInt(document.getElementById('editAge').value);

        if (!name) {
            showNotification('Nome é obrigatório', 'error');
            return false;
        }

        if (age < 16 || age > 50) {
            showNotification('Idade deve estar entre 16 e 50 anos', 'error');
            return false;
        }

        return true;
    }

    function getPositionDisplayName(position) {
        const positions = {
            'atacante': 'Atacante',
            'meio-campo': 'Meio-Campo',
            'defensora': 'Defensora',
            'goleira': 'Goleira'
        };
        return positions[position] || position;
    }

    // Vídeos
    function setupVideoPlayers() {
        playBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const videoItem = this.closest('.video-item');
                const videoTitle = videoItem.querySelector('h4').textContent;
                playVideo(videoTitle);
            });
        });
    }

    function playVideo(title) {
        // Simular reprodução de vídeo
        showNotification(`Reproduzindo: ${title}`, 'info');
        
        // Em produção, abrir player de vídeo ou modal
        console.log('Reproduzindo vídeo:', title);
    }

    function addNewVideo() {
        showNotification('Funcionalidade de adicionar vídeo em desenvolvimento', 'info');
        
        // Em produção, abrir modal para upload de vídeo
        console.log('Adicionar novo vídeo');
    }

    // Estatísticas
    function setupStatsFilter() {
        if (statsFilter) {
            // Carregar dados baseados no filtro selecionado
            filterStats();
        }
    }

    function filterStats() {
        const selectedSeason = statsFilter.value;
        console.log('Filtrando estatísticas para:', selectedSeason);
        
        // Em produção, buscar dados da API baseado na temporada
        updateStatsForSeason(selectedSeason);
    }

    function updateStatsForSeason(season) {
        // Simular dados diferentes por temporada
        const seasonData = {
            '2024': { goals: 12, assists: 8, games: 20, minutes: 1800 },
            '2023': { goals: 20, assists: 12, games: 35, minutes: 3150 },
            '2022': { goals: 15, assists: 3, games: 34, minutes: 2284 },
            'all': { goals: 47, assists: 23, games: 89, minutes: 7234 }
        };

        const data = seasonData[season] || seasonData['all'];
        
        // Atualizar cards de estatísticas
        const statCards = document.querySelectorAll('.stat-card .stat-info h3');
        if (statCards.length >= 4) {
            statCards[0].textContent = data.goals;
            statCards[1].textContent = data.assists;
            statCards[2].textContent = data.games;
            statCards[3].textContent = data.minutes.toLocaleString();
        }

        // Atualizar gráfico
        updateChart(data);
    }

    function updateChart(data) {
        const bars = document.querySelectorAll('.chart-bar .bar');
        const barValues = document.querySelectorAll('.bar-value');
        
        // Simular dados do gráfico
        const chartData = [
            { value: 12, height: 60 },
            { value: 20, height: 100 },
            { value: 15, height: 75 }
        ];

        bars.forEach((bar, index) => {
            if (chartData[index]) {
                bar.style.height = `${chartData[index].height}%`;
                barValues[index].textContent = chartData[index].value;
            }
        });
    }

    // Efeitos de Scroll
    function setupScrollEffects() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            // Mostrar/ocultar logo fixa
            if (currentScrollY > 100) {
                fixedLogo.classList.add('visible');
            } else {
                fixedLogo.classList.remove('visible');
            }

            // Ocultar header ao rolar para baixo
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                document.querySelector('.header').style.transform = 'translateY(-100%)';
            } else {
                document.querySelector('.header').style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });
    }

    // Teclas de Atalho
    function handleKeyboard(e) {
        // ESC para fechar modais
        if (e.key === 'Escape') {
            if (editProfileModal.classList.contains('active')) {
                closeEditModal();
            }
            if (sidebarMenu.classList.contains('active')) {
                closeSidebar();
            }
        }

        // Ctrl + E para editar perfil
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            openEditModal();
        }

        // Ctrl + K para busca
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            toggleSearch();
        }
    }

    // Notificações
    function showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Adicionar estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

        // Adicionar ao DOM
        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Fechar notificação
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });

        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    // Utilitários
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

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Exportar funções para uso global se necessário
    window.ProfileManager = {
        updateUserData: (newData) => {
            userData = { ...userData, ...newData };
            updateProfileDisplay();
        },
        showNotification,
        switchProfileSection
    };

    // Log de inicialização
    console.log('Perfil.js carregado com sucesso!');
    console.log('Dados do usuário:', userData);
});
