// Configurações da API
const API_URL = '../../assets/api/matches.json';
const REFRESH_MS = 30000; // 30s

// Elementos DOM
const listEl = document.getElementById('matchesList');
const favoritesListEl = document.getElementById('favoritesList');
const statusFilterEl = document.getElementById('statusFilter');
const leagueFilterEl = document.getElementById('leagueFilter');
const lastUpdateEl = document.getElementById('lastUpdate');

// Elementos do Header
const hamburgerMenu = document.getElementById('hamburgerMenu');
const sidebarMenu = document.getElementById('sidebarMenu');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const closeMenu = document.getElementById('closeMenu');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const fixedLogo = document.getElementById('fixedLogo');

// Cache de dados
let matchesCache = [];
let favoritesCache = [];

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
  initializeHeader();
  initializeSearch();
  initializeFilters();
  showLoading();
  fetchMatches();
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

    // Busca em tempo real
    searchInput.addEventListener('input', debounce(performSearch, 300));
  }
}

function performSearch() {
  const query = searchInput.value.toLowerCase().trim();
  if (!query) {
    render();
    return;
  }

  const filtered = matchesCache.filter(match =>
    match.homeTeam.name.toLowerCase().includes(query) ||
    match.awayTeam.name.toLowerCase().includes(query) ||
    match.league.toLowerCase().includes(query) ||
    match.venue.toLowerCase().includes(query)
  );

  renderMatches(filtered);
}

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

// Funcionalidades dos Filtros
function initializeFilters() {
  if (statusFilterEl) {
    statusFilterEl.addEventListener('change', render);
  }
  if (leagueFilterEl) {
    leagueFilterEl.addEventListener('change', render);
  }
}

// Formatação de tempo
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

// Renderizar jogos favoritos
function renderFavorites() {
  const liveMatches = matchesCache.filter(m => m.status === 'live');

  if (liveMatches.length === 0) {
    favoritesListEl.innerHTML = `
      <div class="favorite-match" style="text-align: center; padding: 40px; animation: fadeInUp 0.6s ease-out;">
        <div style="color: rgba(255, 255, 255, 0.7); font-size: 1rem;">
          <div style="font-size: 3rem; margin-bottom: 16px; animation: bounce 2s infinite;">⚽</div>
          <h3 style="color: var(--text-light); margin-bottom: 12px; font-weight: 600;">Nenhum jogo ao vivo</h3>
          <p style="margin-bottom: 8px;">Nenhum jogo ao vivo dos seus favoritos no momento</p>
          <p style="font-size: 0.9rem; opacity: 0.8;">
            Acompanhe os jogos em tempo real quando estiverem acontecendo
          </p>
        </div>
      </div>
    `;
    return;
  }

  favoritesListEl.innerHTML = liveMatches.map((m, index) => {
    const progress = Math.min(100, Math.floor((m.minute / 90) * 100));
    const homePlayers = getGoalScorers(m, 'home');
    const awayPlayers = getGoalScorers(m, 'away');
    const link = `./jogo.html?id=${encodeURIComponent(m.id)}`;

    return `
    <a href="${link}" class="favorite-match" style="text-decoration: none; color: inherit; animation: fadeInUp 0.6s ease-out ${index * 0.1}s both;">
      <div class="favorite-team">
        <img src="../../${m.homeTeam.crestUrl}" alt="${m.homeTeam.name}" loading="lazy">
        <div class="favorite-team-name">${m.homeTeam.name}</div>
        ${homePlayers ? `<div class="favorite-players">${homePlayers}</div>` : ''}
      </div>
      <div class="favorite-score">${m.score.home} - ${m.score.away}</div>
      <div class="favorite-team">
        <img src="../../${m.awayTeam.crestUrl}" alt="${m.awayTeam.name}" loading="lazy">
        <div class="favorite-team-name">${m.awayTeam.name}</div>
        ${awayPlayers ? `<div class="favorite-players">${awayPlayers}</div>` : ''}
      </div>
      <div class="favorite-time">${m.minute}'</div>
    </a>
    `;
  }).join('');
}

// Obter artilheiros de um time
function getGoalScorers(match, team) {
  if (!match.timeline || !Array.isArray(match.timeline)) return '';

  const teamName = team === 'home' ? match.homeTeam.name : match.awayTeam.name;
  const goals = match.timeline.filter(event =>
    event.type === 'goal' && event.team === teamName
  );

  if (goals.length === 0) return '';

  // Limitar a 2 artilheiros para não sobrecarregar o layout
  const limitedGoals = goals.slice(0, 2);
  return limitedGoals.map(goal => `${goal.minute}' ${goal.player}`).join(', ');
}

// Renderizar lista principal de jogos
function render() {
  const status = statusFilterEl?.value || 'all';
  const league = leagueFilterEl?.value || 'all';

  const filtered = matchesCache.filter(m =>
    (status === 'all' || m.status === status) &&
    (league === 'all' || m.league === league)
  );

  renderMatches(filtered);
}

function renderMatches(matches) {
  if (!listEl) return;

  if (matches.length === 0) {
    listEl.innerHTML = `
      <div class="match-card" style="text-align: center; padding: 40px;">
        <div style="color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 16px;">🔍</div>
          <h3 style="margin-bottom: 8px; color: var(--text-light);">Nenhum jogo encontrado</h3>
          <p>Tente ajustar os filtros ou buscar por outros termos</p>
        </div>
      </div>
    `;
    return;
  }

  listEl.innerHTML = matches.map((m, index) => {
    const progress = m.status === 'live' ? Math.min(100, Math.floor((m.minute / 90) * 100)) : 0;
    const stage = [m.stage, m.round ? `Jg ${m.round}` : null].filter(Boolean).join(' • ');
    const broadcasters = Array.isArray(m.broadcasters) ? m.broadcasters.join(', ') : '';
    const lastEvent = formatLastEvent(m.lastEvent);
    const link = `./jogo.html?id=${encodeURIComponent(m.id)}`;

    return `
    <article class="match-card" data-category="${m.status}" style="animation: fadeInUp 0.6s ease-out ${index * 0.1}s both;">
      <div class="match-header">
        <div class="match-league">${m.league}${stage ? ` • ${stage}` : ''}</div>
        <span class="badge ${m.status}">${labelStatus(m)}</span>
      </div>
      ${m.status === 'live' ? `<div class="live-bar"><div class="live-bar-inner" style="width:${progress}%"></div></div>` : ''}
      <a class="match-row" href="${link}" aria-label="Abrir detalhes do jogo ${m.homeTeam.name} vs ${m.awayTeam.name}">
        <div class="team">
          <img alt="${m.homeTeam.name}" src="../../${m.homeTeam.crestUrl}" loading="lazy">
          <span class="team-name">${m.homeTeam.name}</span>
        </div>
        <div class="score">${m.score.home} - ${m.score.away}</div>
        <div class="team">
          <span class="team-name">${m.awayTeam.name}</span>
          <img alt="${m.awayTeam.name}" src="../../${m.awayTeam.crestUrl}" loading="lazy">
        </div>
      </a>
      <div class="meta">
        <span>${m.status === 'scheduled' ? 'Início ' + formatTime(m.startTime) : m.status === 'live' ? (m.minute + "'") : 'Final'}</span>
        <span> • </span>
        <span>${m.venue}</span>
        ${broadcasters ? `<span> • </span><span>Transmissão: ${broadcasters}</span>` : ''}
        ${m.referee ? `<span> • </span><span>Árbitra: ${m.referee}</span>` : ''}
      </div>
      ${lastEvent ? `<div class="last-event">${lastEvent}</div>` : ''}
    </article>`;
  }).join('');
}

function labelStatus(m) {
  if (m.status === 'live') return 'Ao vivo';
  if (m.status === 'scheduled') return 'Agendado';
  if (m.status === 'finished') return 'Finalizado';
  return m.status;
}

function formatLastEvent(evt) {
  if (!evt) return '';
  if (evt.type === 'goal') return `Último evento: ⚽ ${evt.player} (${evt.team}) aos ${evt.minute}'`;
  if (evt.type === 'card') return `Último evento: 🟨 Cartão aos ${evt.minute}'`;
  if (evt.type === 'sub') return `Último evento: 🔁 Substituição ${evt.minute}'`;
  if (evt.type === 'end') return `Fim de jogo`;
  return '';
}

// Buscar dados da API
async function fetchMatches() {
  try {
    const res = await fetch(API_URL + `?t=${Date.now()}`);
    if (!res.ok) throw new Error('Falha ao carregar jogos');
    const data = await res.json();
    matchesCache = Array.isArray(data.matches) ? data.matches : [];
    updateLeagueFilter();
    renderFavorites();
    render();
    updateLastUpdateTime();
  } catch (err) {
    showError(err.message);
  }
}

function updateLeagueFilter() {
  if (!leagueFilterEl) return;

  const leagues = Array.from(new Set(matchesCache.map(m => m.league)));
  const current = leagueFilterEl.value;
  leagueFilterEl.innerHTML = '<option value="all">Todas as ligas</option>' +
    leagues.map(l => `<option value="${l}">${l}</option>`).join('');

  if (leagues.includes(current)) {
    leagueFilterEl.value = current;
  }
}

function updateLastUpdateTime() {
  if (lastUpdateEl) {
    lastUpdateEl.textContent = `Atualizado em: ${new Date().toLocaleTimeString('pt-BR')}`;
  }
}

// Estados de loading e erro
function showLoading() {
  if (listEl) {
    listEl.innerHTML = `
      <div class="loading-container" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
        <div class="loading-spinner"></div>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Carregando jogos...</p>
      </div>
    `;
  }

  if (favoritesListEl) {
    favoritesListEl.innerHTML = `
      <div class="loading-container" style="text-align: center; padding: 30px;">
        <div class="loading-spinner" style="width: 30px; height: 30px; border-width: 3px;"></div>
        <p style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;">Carregando favoritos...</p>
      </div>
    `;
  }
}

function showError(message) {
  if (listEl) {
    listEl.innerHTML = `
      <div class="match-card" style="text-align: center; padding: 40px;">
        <div style="color: var(--live-color);">
          <div style="font-size: 3rem; margin-bottom: 16px;">⚠️</div>
          <h3 style="margin-bottom: 8px; color: var(--text-light);">Erro ao carregar jogos</h3>
          <p>${message}</p>
        </div>
      </div>
    `;
  }

  if (favoritesListEl) {
    favoritesListEl.innerHTML = `
      <div class="favorite-match" style="text-align: center; padding: 30px;">
        <div style="color: rgba(255, 255, 255, 0.7);">
          <div style="font-size: 2rem; margin-bottom: 12px;">⚠️</div>
          <p>${message}</p>
        </div>
      </div>
    `;
  }
}

// Simulação de atualizações em tempo real
function simulateLiveUpdates() {
  matchesCache.forEach(match => {
    if (match.status === 'live' && match.minute < 90) {
      // Simular progresso do jogo
      match.minute += Math.floor(Math.random() * 3) + 1;

      // Simular eventos ocasionais
      if (Math.random() < 0.1) { // 10% chance de evento
        const events = ['goal', 'card', 'sub'];
        const eventType = events[Math.floor(Math.random() * events.length)];
        const team = Math.random() < 0.5 ? match.homeTeam.name : match.awayTeam.name;

        match.lastEvent = {
          type: eventType,
          team: team,
          minute: match.minute,
          player: eventType === 'goal' ? 'Jogadora' : ''
        };

        if (eventType === 'goal') {
          if (team === match.homeTeam.name) {
            match.score.home++;
          } else {
            match.score.away++;
          }
        }
      }

      // Finalizar jogo se chegou aos 90 minutos
      if (match.minute >= 90) {
        match.status = 'finished';
        match.lastEvent = { type: 'end', minute: 90 };
      }
    }
  });
}

// Auto-refresh
function startAutoRefresh() {
  // Atualizar a cada 30 segundos
  setInterval(() => {
    simulateLiveUpdates();
    fetchMatches();
  }, REFRESH_MS);

  // Atualizar favoritos a cada 10 segundos para jogos ao vivo
  setInterval(() => {
    if (matchesCache.some(m => m.status === 'live')) {
      simulateLiveUpdates();
      renderFavorites();
    }
  }, 10000);
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
    margin: 0 auto 16px;
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