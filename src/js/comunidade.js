// Comunidade.js - Funcionalidades da página de comunidade
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos do DOM
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeMenu = document.getElementById('closeMenu');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const videoPosts = document.querySelectorAll('.video-post');
    const header = document.querySelector('.header');
    const fixedLogo = document.getElementById('fixedLogo');

    // Variáveis de controle
    let isMenuOpen = false;
    let isSearchExpanded = false;
    let currentFilter = 'todos';

    // ===== FUNCIONALIDADES DO MENU HAMBÚRGUER =====
    
    // Abrir menu lateral
    function openSidebar() {
        sidebarMenu.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        isMenuOpen = true;
    }

    // Fechar menu lateral
    function closeSidebar() {
        sidebarMenu.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
        isMenuOpen = false;
        
        // Fechar dropdown mobile quando fechar o menu lateral
        if (dropdownMobile) {
            dropdownMobile.classList.remove('active');
        }
    }

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

    // Event listeners do menu
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', openSidebar);
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', closeSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Fechar menu com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeSidebar();
        }
    });

    // ===== FUNCIONALIDADES DA BARRA DE BUSCA =====
    
    // Expandir barra de busca
    function expandSearch() {
        if (!isSearchExpanded) {
            searchBox.classList.add('expanded');
            searchInput.focus();
            isSearchExpanded = true;
        }
    }

    // Colapsar barra de busca
    function collapseSearch() {
        if (isSearchExpanded && searchInput.value === '') {
            searchBox.classList.remove('expanded');
            isSearchExpanded = false;
        }
    }

    // Event listeners da busca
    if (searchBox) {
        searchBox.addEventListener('click', expandSearch);
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isSearchExpanded) {
                performSearch();
            } else {
                expandSearch();
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('blur', collapseSearch);
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }

    // Função de busca
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            console.log('Buscando por:', searchTerm);
            // Aqui você pode implementar a lógica de busca
            // Por exemplo, filtrar vídeos por termo de busca
            filterVideosBySearch(searchTerm);
        }
    }

    // ===== FUNCIONALIDADES DOS FILTROS =====
    
    // Aplicar filtro de categoria
    function applyFilter(category) {
        currentFilter = category;
        
        // Atualizar botões ativos
        filterTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            }
        });

        // Filtrar vídeos
        filterVideos(category);
    }

    // Filtrar vídeos por categoria
    function filterVideos(category) {
        videoPosts.forEach(post => {
            const postCategory = post.dataset.category;
            
            if (category === 'todos' || postCategory === category) {
                post.style.display = 'block';
                post.style.animation = 'fadeIn 0.5s ease-out';
            } else {
                post.style.display = 'none';
            }
        });
    }

    // Filtrar vídeos por busca
    function filterVideosBySearch(searchTerm) {
        videoPosts.forEach(post => {
            const description = post.querySelector('.video-description p').textContent.toLowerCase();
            const username = post.querySelector('.username').textContent.toLowerCase();
            const userTitle = post.querySelector('.user-title').textContent.toLowerCase();
            
            const matches = description.includes(searchTerm.toLowerCase()) ||
                          username.includes(searchTerm.toLowerCase()) ||
                          userTitle.includes(searchTerm.toLowerCase());
            
            if (matches) {
                post.style.display = 'block';
                post.style.animation = 'fadeIn 0.5s ease-out';
            } else {
                post.style.display = 'none';
            }
        });
    }

    // Event listeners dos filtros
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.dataset.category;
            applyFilter(category);
        });
    });

    // ===== FUNCIONALIDADES DO HEADER E FILTROS =====
    
    // Controlar visibilidade do header e filtros ao rolar
    let lastScrollTop = 0;
    let isHeaderVisible = true;
    let isFiltersVisible = true;
    const categoryFilters = document.querySelector('.category-filters');
    const videoFeed = document.querySelector('.video-feed');

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Mostrar/ocultar header baseado na direção do scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - ocultar header e filtros simultaneamente
            if (isHeaderVisible) {
                header.classList.add('hidden');
                fixedLogo.classList.add('visible');
                isHeaderVisible = false;
            }
            
            // Ocultar filtros ao mesmo tempo que o header
            if (isFiltersVisible) {
                categoryFilters.classList.add('hidden');
                isFiltersVisible = false;
                
                // Ajustar espaçamento do conteúdo quando filtros estão ocultos
                if (videoFeed) {
                    videoFeed.style.marginTop = '20px';
                }
            }
        } else {
            // Scrolling up - mostrar header e filtros simultaneamente
            if (!isHeaderVisible) {
                header.classList.remove('hidden');
                fixedLogo.classList.remove('visible');
                isHeaderVisible = true;
            }
            
            // Mostrar filtros ao mesmo tempo que o header
            if (!isFiltersVisible) {
                categoryFilters.classList.remove('hidden');
                isFiltersVisible = true;
                
                // Restaurar espaçamento normal do conteúdo
                if (videoFeed) {
                    videoFeed.style.marginTop = '80px';
                }
            }
        }
        
        lastScrollTop = scrollTop;
    }

    // Event listener do scroll
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ===== FUNCIONALIDADES DOS VÍDEOS =====
    
    // Simular reprodução de vídeo
    function playVideo(videoPost) {
        const playButton = videoPost.querySelector('.play-button');
        const thumbnail = videoPost.querySelector('.video-thumbnail img');
        
        // Adicionar efeito de loading
        playButton.innerHTML = '⏸';
        playButton.style.background = 'rgba(0, 0, 0, 0.8)';
        
        // Simular carregamento
        setTimeout(() => {
            playButton.innerHTML = '▶';
            playButton.style.background = 'var(--cbf-blue)';
            console.log('Vídeo reproduzido:', videoPost.querySelector('.username').textContent);
        }, 2000);
    }

    // Event listeners dos vídeos
    videoPosts.forEach(post => {
        const playOverlay = post.querySelector('.play-overlay');
        const thumbnail = post.querySelector('.video-thumbnail');
        
        if (playOverlay) {
            playOverlay.addEventListener('click', function() {
                playVideo(post);
            });
        }
        
        if (thumbnail) {
            thumbnail.addEventListener('click', function() {
                playVideo(post);
            });
        }
    });

    // ===== FUNCIONALIDADES DE INTERAÇÃO =====
    
    // Curtir vídeo
    function likeVideo(videoPost) {
        const likeStat = videoPost.querySelector('.stat:first-child span');
        if (likeStat) {
            let currentLikes = parseInt(likeStat.textContent.replace(/[^\d]/g, ''));
            likeStat.textContent = (currentLikes + 1).toLocaleString();
            
            // Adicionar efeito visual
            likeStat.style.color = 'var(--cbf-yellow)';
            setTimeout(() => {
                likeStat.style.color = '';
            }, 1000);
        }
    }

    // Compartilhar vídeo
    function shareVideo(videoPost) {
        const shareStat = videoPost.querySelector('.stat:nth-child(2) span');
        if (shareStat) {
            let currentShares = parseInt(shareStat.textContent.replace(/[^\d]/g, ''));
            shareStat.textContent = (currentShares + 1).toLocaleString();
            
            // Simular compartilhamento
            if (navigator.share) {
                navigator.share({
                    title: 'Vídeo do Passa a Bola',
                    text: 'Confira este vídeo incrível do futebol feminino!',
                    url: window.location.href
                });
            } else {
                // Fallback para navegadores que não suportam Web Share API
                navigator.clipboard.writeText(window.location.href);
                showNotification('Link copiado para a área de transferência!');
            }
        }
    }

    // Comentar vídeo
    function commentVideo(videoPost) {
        const commentStat = videoPost.querySelector('.stat:last-child span');
        if (commentStat) {
            let currentComments = parseInt(commentStat.textContent.replace(/[^\d]/g, ''));
            commentStat.textContent = (currentComments + 1).toLocaleString();
            
            // Simular abertura de modal de comentários
            showCommentModal(videoPost);
        }
    }

    // Mostrar modal de comentários
    function showCommentModal(videoPost) {
        const username = videoPost.querySelector('.username').textContent;
        const description = videoPost.querySelector('.video-description p').textContent;
        
        // Criar modal simples
        const modal = document.createElement('div');
        modal.className = 'comment-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Comentários</h3>
                    <button class="close-modal">✕</button>
                </div>
                <div class="modal-body">
                    <div class="video-info">
                        <strong>${username}</strong>
                        <p>${description}</p>
                    </div>
                    <div class="comments-section">
                        <p>Funcionalidade de comentários em desenvolvimento...</p>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar estilos
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners do modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // ===== FUNCIONALIDADES DO BOTÃO DE UPLOAD =====
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            showUploadModal();
        });
    }

    // Mostrar modal de upload
    function showUploadModal() {
        const modal = document.createElement('div');
        modal.className = 'upload-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Compartilhar Vídeo</h3>
                    <button class="close-modal">✕</button>
                </div>
                <div class="modal-body">
                    <div class="upload-area">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                        <p>Arraste e solte seu vídeo aqui</p>
                        <p>ou</p>
                        <button class="select-file-btn">Selecionar arquivo</button>
                    </div>
                    <div class="upload-form" style="display: none;">
                        <input type="text" placeholder="Escreva uma legenda..." class="caption-input">
                        <select class="category-select">
                            <option value="gols">Gols</option>
                            <option value="treinos">Treinos</option>
                            <option value="bastidores">Bastidores</option>
                            <option value="dicas">Dicas</option>
                            <option value="jogos">Jogos</option>
                        </select>
                        <button class="upload-submit-btn">Publicar</button>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar estilos
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners do modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Simular seleção de arquivo
        modal.querySelector('.select-file-btn').addEventListener('click', () => {
            modal.querySelector('.upload-area').style.display = 'none';
            modal.querySelector('.upload-form').style.display = 'block';
        });
        
        // Simular upload
        modal.querySelector('.upload-submit-btn').addEventListener('click', () => {
            showNotification('Vídeo publicado com sucesso!');
            document.body.removeChild(modal);
        });
    }

    // ===== FUNCIONALIDADES AUXILIARES =====
    
    // Mostrar notificação
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--cbf-blue);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 3000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // ===== FUNCIONALIDADES DA LOGO =====
    
    // Garantir que a logo sempre volte para home
    const logoLinks = document.querySelectorAll('.logo-link, .fixed-logo-link');
    console.log('Logo links encontrados:', logoLinks.length);
    
    logoLinks.forEach((link, index) => {
        console.log(`Configurando logo link ${index + 1}:`, link);
        link.addEventListener('click', function(e) {
            console.log('Logo clicada! Navegando para home...');
            e.preventDefault();
            e.stopPropagation();
            
            // Tentar múltiplas formas de navegação
            try {
                window.location.href = '../../index.html';
            } catch (error) {
                console.error('Erro na navegação:', error);
                // Fallback
                window.location.assign('../../index.html');
            }
        });
    });

    // ===== FUNCIONALIDADES DOS DESAFIOS =====
    
    // Aceitar desafio
    function acceptChallenge(challengePost) {
        const acceptBtn = challengePost.querySelector('.challenge-btn.accept');
        if (acceptBtn) {
            acceptBtn.textContent = 'Desafio Aceito!';
            acceptBtn.style.background = '#28a745';
            acceptBtn.disabled = true;
            
            showNotification('Desafio aceito! Boa sorte! 🏆');
            
            // Simular abertura de modal de gravação
            setTimeout(() => {
                showRecordingModal(challengePost);
            }, 1000);
        }
    }
    
    // Compartilhar desafio
    function shareChallenge(challengePost) {
        const shareBtn = challengePost.querySelector('.challenge-btn.share');
        if (shareBtn) {
            showNotification('Desafio compartilhado! 📱');
            
            // Simular compartilhamento
            if (navigator.share) {
                navigator.share({
                    title: 'Desafio do Passa a Bola',
                    text: 'Confira este desafio incrível do futebol feminino!',
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
            }
        }
    }
    
    // Mostrar modal de gravação
    function showRecordingModal(challengePost) {
        const modal = document.createElement('div');
        modal.className = 'recording-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Gravar Resposta ao Desafio</h3>
                    <button class="close-modal">✕</button>
                </div>
                <div class="modal-body">
                    <div class="recording-area">
                        <div class="camera-preview">
                            <div class="camera-placeholder">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                                </svg>
                                <p>Visualização da câmera</p>
                            </div>
                        </div>
                        <div class="recording-controls">
                            <button class="record-btn">🎥 Gravar</button>
                            <button class="stop-btn" style="display: none;">⏹ Parar</button>
                        </div>
                        <div class="recording-info">
                            <p>Reproduza o movimento do desafio e grave sua resposta!</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar estilos
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners do modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Simular gravação
        const recordBtn = modal.querySelector('.record-btn');
        const stopBtn = modal.querySelector('.stop-btn');
        
        recordBtn.addEventListener('click', () => {
            recordBtn.style.display = 'none';
            stopBtn.style.display = 'inline-block';
            showNotification('Gravando... 🎥');
            
            // Simular parada da gravação após 5 segundos
            setTimeout(() => {
                stopBtn.click();
            }, 5000);
        });
        
        stopBtn.addEventListener('click', () => {
            showNotification('Gravação finalizada! Enviando... 📤');
            setTimeout(() => {
                document.body.removeChild(modal);
                showNotification('Resposta ao desafio enviada com sucesso! 🏆');
            }, 2000);
        });
    }
    
    // Event listeners dos botões de desafio
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('challenge-btn')) {
            const challengePost = e.target.closest('.challenge-post');
            if (e.target.classList.contains('accept')) {
                acceptChallenge(challengePost);
            } else if (e.target.classList.contains('share')) {
                shareChallenge(challengePost);
            }
        }
    });

    // ===== INICIALIZAÇÃO =====
    
    // Aplicar filtro inicial
    applyFilter('todos');
    
    // Configurar animações CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .comment-modal .modal-content,
        .upload-modal .modal-content {
            background: var(--bg-card);
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .modal-header h3 {
            color: var(--text-primary);
            margin: 0;
        }
        
        .close-modal {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 24px;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        
        .close-modal:hover {
            background: var(--border-color);
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .upload-area {
            text-align: center;
            padding: 40px 20px;
            border: 2px dashed var(--border-color);
            border-radius: 8px;
            color: var(--text-secondary);
        }
        
        .upload-area svg {
            color: var(--cbf-blue);
            margin-bottom: 16px;
        }
        
        .select-file-btn {
            background: var(--cbf-blue);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 16px;
        }
        
        .caption-input,
        .category-select {
            width: 100%;
            padding: 12px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background: var(--bg-dark);
            color: var(--text-primary);
            margin-bottom: 16px;
        }
        
        .upload-submit-btn {
            width: 100%;
            background: var(--cbf-blue);
            color: white;
            border: none;
            padding: 12px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
        }
        
        /* Estilos do modal de gravação */
        .recording-modal .modal-content {
            background: var(--bg-card);
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .recording-area {
            text-align: center;
        }
        
        .camera-preview {
            background: #000;
            border-radius: 8px;
            margin-bottom: 20px;
            overflow: hidden;
        }
        
        .camera-placeholder {
            padding: 60px 20px;
            color: var(--text-secondary);
        }
        
        .camera-placeholder svg {
            color: var(--cbf-blue);
            margin-bottom: 16px;
        }
        
        .recording-controls {
            margin-bottom: 20px;
        }
        
        .record-btn,
        .stop-btn {
            background: var(--cbf-blue);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            margin: 0 8px;
            transition: all 0.3s ease;
        }
        
        .record-btn:hover,
        .stop-btn:hover {
            background: var(--cbf-dark);
            transform: translateY(-1px);
        }
        
        .stop-btn {
            background: #dc3545;
        }
        
        .stop-btn:hover {
            background: #c82333;
        }
        
        .recording-info p {
            color: var(--text-secondary);
            font-size: 14px;
            margin: 0;
        }
    `;
    document.head.appendChild(style);
    
    console.log('Comunidade.js carregado com sucesso!');
});
