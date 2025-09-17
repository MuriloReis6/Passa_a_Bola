// Configurações da API
const API_URL = '../../assets/api/matches.json';

// Elementos DOM
const headerEl = document.getElementById('matchHeader');
const timelineEl = document.getElementById('timeline');
const statsEl = document.getElementById('stats');

// Elementos do Header
const hamburgerMenu = document.getElementById('hamburgerMenu');
const sidebarMenu = document.getElementById('sidebarMenu');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const closeMenu = document.getElementById('closeMenu');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const fixedLogo = document.getElementById('fixedLogo');

// Cache de dados
let currentMatch = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
  initializeHeader();
  initializeSearch();
  load();
  startAutoRefresh();
});

// Funcionalidades do Header
function initializeHeader() {
  // Menu hambúrguer
  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', toggleSidebar);
  }

  // Fechar menu
  if (closeMenu) {
    closeMenu.addEventListener('click', closeSidebar);
  }

  // Overlay para fechar menu
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // Logo fixa ao rolar
  window.addEventListener('scroll', handleScroll);
}

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

function handleScroll() {
  const scrollY = window.scrollY;
  if (scrollY > 100) {
    fixedLogo.classList.add('visible');
  } else {
    fixedLogo.classList.remove('visible');
  }
}

// Funcionalidades de Busca
function initializeSearch() {
  if (searchInput && searchBtn) {
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
}

function performSearch() {
  const query = searchInput.value.toLowerCase().trim();
  if (query) {
    // Redirecionar para página de jogos com busca
    window.location.href = `./jogos.html?search=${encodeURIComponent(query)}`;
  }
}

// Utilitários
function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function percent(a, b) {
  if (!b) return 0;
  return Math.max(0, Math.min(100, Math.round((a / (a + b)) * 100)));
}

function labelStatus(s) {
  if (s === 'live') return 'Ao vivo';
  if (s === 'scheduled') return 'Agendado';
  if (s === 'finished') return 'Finalizado';
  return s;
}

function formatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  } catch (_) {
    return '';
  }
}

// Carregar dados do jogo
async function load() {
  const id = getParam('id');
  if (!id) {
    showError('Jogo não encontrado');
    return;
  }

  try {
    showLoading();
    const res = await fetch(API_URL + `?t=${Date.now()}`);
    if (!res.ok) throw new Error('Falha ao carregar dados do jogo');

    const data = await res.json();
    const match = (data.matches || []).find(m => m.id === id);

    if (!match) {
      showError('Jogo não encontrado');
      return;
    }

    currentMatch = match;
    renderHeader(match);
    renderTimeline(match);
    renderStats(match);
    updatePageTitle(match);
  } catch (err) {
    showError('Erro ao carregar dados do jogo: ' + err.message);
  }
}

function updatePageTitle(match) {
  document.title = `${match.homeTeam.name} vs ${match.awayTeam.name} - Passa a Bola | Futebol Feminino`;
}

// Renderizar cabeçalho do jogo
function renderHeader(m) {
  if (!headerEl) return;

  const progress = m.status === 'live' ? Math.min(100, Math.floor((m.minute / 90) * 100)) : 0;
  const stage = [m.stage, m.round ? `Jg ${m.round}` : null].filter(Boolean).join(' • ');
  const broadcasters = Array.isArray(m.broadcasters) ? m.broadcasters.join(', ') : '';

  headerEl.innerHTML = `
    <div class="match-teams">
      <div class="team">
        <img src="../../${m.homeTeam.crestUrl}" alt="${m.homeTeam.name}" loading="lazy">
        <span class="team-name">${m.homeTeam.name}</span>
      </div>
      <div class="match-score">${m.score.home} - ${m.score.away}</div>
      <div class="team">
        <img src="../../${m.awayTeam.crestUrl}" alt="${m.awayTeam.name}" loading="lazy">
        <span class="team-name">${m.awayTeam.name}</span>
      </div>
    </div>
    <div class="match-meta">
      <div class="match-status">${labelStatus(m.status)}</div>
      <div class="match-info">
        <div>${m.status === 'scheduled' ? 'Início ' + formatTime(m.startTime) : m.status === 'live' ? (m.minute + "'") : 'Final'}</div>
        <div>${m.league}${stage ? ` • ${stage}` : ''}</div>
        <div>${m.venue}</div>
        ${broadcasters ? `<div>Transmissão: ${broadcasters}</div>` : ''}
        ${m.referee ? `<div>Árbitra: ${m.referee}</div>` : ''}
      </div>
    </div>
  `;
}

// Renderizar timeline do jogo
function renderTimeline(m) {
  if (!timelineEl) return;

  const events = Array.isArray(m.timeline) ? m.timeline : [];

  if (events.length === 0) {
    timelineEl.innerHTML = `
      <h2>Timeline do Jogo</h2>
      <div class="timeline-item">
        <div class="timeline-time">-</div>
        <div class="timeline-event">
          <span class="timeline-icon">⏱️</span>
          <span class="timeline-text">Nenhum evento registrado</span>
        </div>
      </div>
    `;
    return;
  }

  // Ordenar eventos por minuto
  const sortedEvents = events.sort((a, b) => (a.minute || 0) - (b.minute || 0));

  timelineEl.innerHTML = `
    <h2>Timeline do Jogo</h2>
    ${sortedEvents.map(e => {
    const icon = getEventIcon(e.type);
    const player = e.player ? `<span class="timeline-player">${e.player}</span>` : '';
    const team = e.team ? ` (${e.team})` : '';

    return `
        <div class="timeline-item" data-event-type="${e.type}">
          <div class="timeline-time">${e.minute || 0}'</div>
          <div class="timeline-event">
            <span class="timeline-icon">${icon}</span>
            <span class="timeline-text">${player}${team}</span>
          </div>
        </div>
      `;
  }).join('')}
  `;
}

function getEventIcon(type) {
  const icons = {
    'goal': '⚽',
    'card': '🟨',
    'sub': '🔁',
    'end': '🏁',
    'start': '▶️',
    'half': '⏸️'
  };
  return icons[type] || '⏱️';
}

// Renderizar estatísticas
function renderStats(m) {
  if (!statsEl) return;

  if (!m.stats) {
    statsEl.innerHTML = `
      <h2>Estatísticas</h2>
      <div class="stat-row">
        <span class="stat-label">Nenhuma estatística disponível</span>
      </div>
    `;
    return;
  }

  const s = m.stats;
  statsEl.innerHTML = `
    <h2>Estatísticas</h2>
    ${renderStat('Posse de bola', s.possession?.home || 0, s.possession?.away || 0, '%')}
    ${renderStat('Finalizações', s.shots?.home || 0, s.shots?.away || 0)}
    ${renderStat('No alvo', s.shotsOnTarget?.home || 0, s.shotsOnTarget?.away || 0)}
    ${renderStat('Escanteios', s.corners?.home || 0, s.corners?.away || 0)}
    ${renderStat('Faltas', s.fouls?.home || 0, s.fouls?.away || 0)}
    ${renderStat('Cartões amarelos', s.yellowCards?.home || 0, s.yellowCards?.away || 0)}
    ${renderStat('Cartões vermelhos', s.redCards?.home || 0, s.redCards?.away || 0)}
  `;
}

function renderStat(label, home, away, suffix = '') {
  const p = percent(home, away);
  return `
    <div class="stat-row">
      <span class="stat-label">${label}</span>
      <div class="stat-values">
        <span class="stat-value">${home}${suffix}</span>
        <div class="progress" aria-label="${label}">
          <div class="bar" style="width:${p}%"></div>
        </div>
        <span class="stat-value">${away}${suffix}</span>
      </div>
    </div>
  `;
}

// Estados de loading e erro
function showLoading() {
  if (headerEl) {
    headerEl.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div class="loading-spinner"></div>
        <p style="color: var(--text-muted); margin-top: 16px;">Carregando dados do jogo...</p>
      </div>
    `;
  }

  if (timelineEl) {
    timelineEl.innerHTML = `
      <h2>Timeline do Jogo</h2>
      <div style="text-align: center; padding: 20px;">
        <div class="loading-spinner" style="width: 30px; height: 30px; border-width: 3px;"></div>
        <p style="color: var(--text-muted); margin-top: 12px; font-size: 0.9rem;">Carregando eventos...</p>
      </div>
    `;
  }

  if (statsEl) {
    statsEl.innerHTML = `
      <h2>Estatísticas</h2>
      <div style="text-align: center; padding: 20px;">
        <div class="loading-spinner" style="width: 30px; height: 30px; border-width: 3px;"></div>
        <p style="color: var(--text-muted); margin-top: 12px; font-size: 0.9rem;">Carregando estatísticas...</p>
      </div>
    `;
  }
}

function showError(message) {
  if (headerEl) {
    headerEl.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="color: var(--live-color); font-size: 3rem; margin-bottom: 16px;">⚠️</div>
        <h3 style="color: var(--text-light); margin-bottom: 8px;">Erro</h3>
        <p style="color: var(--text-muted);">${message}</p>
      </div>
    `;
  }

  if (timelineEl) {
    timelineEl.innerHTML = `
      <h2>Timeline do Jogo</h2>
      <div style="text-align: center; padding: 20px; color: var(--text-muted);">
        <p>Não foi possível carregar os eventos do jogo</p>
      </div>
    `;
  }

  if (statsEl) {
    statsEl.innerHTML = `
      <h2>Estatísticas</h2>
      <div style="text-align: center; padding: 20px; color: var(--text-muted);">
        <p>Não foi possível carregar as estatísticas</p>
      </div>
    `;
  }
}

// Auto-refresh para jogos ao vivo
function startAutoRefresh() {
  // Verificar se é um jogo ao vivo a cada 30 segundos
  setInterval(async () => {
    if (currentMatch && currentMatch.status === 'live') {
      try {
        const res = await fetch(API_URL + `?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          const updatedMatch = (data.matches || []).find(m => m.id === currentMatch.id);

          if (updatedMatch && updatedMatch.status === 'live') {
            currentMatch = updatedMatch;
            renderHeader(updatedMatch);
            renderTimeline(updatedMatch);
            renderStats(updatedMatch);
          }
        }
      } catch (err) {
        console.warn('Erro ao atualizar dados do jogo:', err);
      }
    }
  }, 30000);
}

// Adicionar animação de loading
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .loading-spinner {
    width: 40px; 
    height: 40px; 
    border: 4px solid rgba(255, 255, 255, 0.1); 
    border-top: 4px solid var(--accent); 
    border-radius: 50%; 
    animation: spin 1s linear infinite; 
    margin: 0 auto;
  }
  
  .timeline-item[data-event-type="goal"] {
    background: rgba(34, 197, 94, 0.05);
    border-left: 3px solid #22c55e;
  }
  
  .timeline-item[data-event-type="card"] {
    background: rgba(245, 158, 11, 0.05);
    border-left: 3px solid #f59e0b;
  }
  
  .timeline-item[data-event-type="sub"] {
    background: rgba(59, 130, 246, 0.05);
    border-left: 3px solid #3b82f6;
  }
`;
document.head.appendChild(style);

// Funcionalidades de acessibilidade
document.addEventListener('keydown', function (e) {
  // ESC para fechar menu
  if (e.key === 'Escape') {
    closeSidebar();
  }
});

// Lazy loading para imagens
function initializeLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
}

// Inicializar lazy loading quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Compartilhar jogo
function shareMatch() {
  if (navigator.share && currentMatch) {
    navigator.share({
      title: `${currentMatch.homeTeam.name} vs ${currentMatch.awayTeam.name}`,
      text: `Acompanhe o jogo ${currentMatch.homeTeam.name} vs ${currentMatch.awayTeam.name} no Passa a Bola`,
      url: window.location.href
    });
  } else {
    // Fallback para copiar link
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copiado para a área de transferência!');
    });
  }
}

// Adicionar botão de compartilhamento se suportado
if (navigator.share || navigator.clipboard) {
  document.addEventListener('DOMContentLoaded', function () {
    const shareButton = document.createElement('button');
    shareButton.innerHTML = '📤 Compartilhar';
    shareButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--accent);
      color: white;
      border: none;
      padding: 12px 16px;
      border-radius: 25px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(153, 42, 187, 0.3);
      transition: all 0.3s ease;
      z-index: 1000;
    `;

    shareButton.addEventListener('click', shareMatch);
    shareButton.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 6px 16px rgba(153, 42, 187, 0.4)';
    });
    shareButton.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 12px rgba(153, 42, 187, 0.3)';
    });

    document.body.appendChild(shareButton);
  });
}