// Dados dos times da Série A
const serieATeams = [
    {
        id: 'america-mineiro',
        name: 'América-MG',
        logo: '../../assets/serie a/america-mineiro.svg',
        info: 'Clube Atlético Mineiro'
    },
    {
        id: 'bahia',
        name: 'Bahia',
        logo: '../../assets/serie a/bahia.svg',
        info: 'Esporte Clube Bahia'
    },
    {
        id: 'corinthians',
        name: 'Corinthians',
        logo: '../../assets/serie a/corinthians.svg',
        info: 'Sport Club Corinthians Paulista'
    },
    {
        id: 'flamengo',
        name: 'Flamengo',
        logo: '../../assets/serie a/flamengo.svg',
        info: 'Clube de Regatas do Flamengo'
    },
    {
        id: 'fluminense',
        name: 'Fluminense',
        logo: '../../assets/serie a/fluminense.svg',
        info: 'Fluminense Football Club'
    },
    {
        id: 'gremio',
        name: 'Grêmio',
        logo: '../../assets/serie a/gremio.svg',
        info: 'Grêmio Foot-Ball Porto Alegrense'
    },
    {
        id: 'internacional',
        name: 'Internacional',
        logo: '../../assets/serie a/internacional.svg',
        info: 'Sport Club Internacional'
    },
    {
        id: 'juventude',
        name: 'Juventude',
        logo: '../../assets/serie a/juventude.svg',
        info: 'Esporte Clube Juventude'
    },
    {
        id: 'palmeiras',
        name: 'Palmeiras',
        logo: '../../assets/serie a/palmeiras.svg',
        info: 'Sociedade Esportiva Palmeiras'
    },
    {
        id: 'red-bull-bragantino',
        name: 'Red Bull Bragantino',
        logo: '../../assets/serie a/red-bull-bragantino.svg',
        info: 'Red Bull Bragantino'
    },
    {
        id: 'sao-paulo',
        name: 'São Paulo',
        logo: '../../assets/serie a/sao-paulo-futebol-clube.svg',
        info: 'São Paulo Futebol Clube'
    },
    {
        id: 'sport-recife',
        name: 'Sport Recife',
        logo: '../../assets/serie a/sport-recife.svg',
        info: 'Sport Club do Recife'
    }
];

// Elementos DOM
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const brasilTeamsGrid = document.getElementById('brasil-teams');

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    initializeTabs();
    loadBrasilTeams();
    setupSearch();
});

// Funcionalidade das abas
function initializeTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const targetTab = this.dataset.tab;

            // Remove active de todos os botões e conteúdos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Adiciona active ao botão clicado e conteúdo correspondente
            this.classList.add('active');
            document.getElementById(`${targetTab}-content`).classList.add('active');

            // Adiciona efeito de ripple
            createRippleEffect(this);
        });
    });
}

// Efeito ripple nos botões
function createRippleEffect(button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Carrega os times do Brasil
function loadBrasilTeams() {
    if (!brasilTeamsGrid) return;

    // Mostra loading
    brasilTeamsGrid.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';

    // Simula carregamento
    setTimeout(() => {
        brasilTeamsGrid.innerHTML = serieATeams.map(team => createTeamCard(team)).join('');
        addTeamCardInteractions();
    }, 800);
}

// Cria o HTML de um card de time
function createTeamCard(team) {
    return `
    <div class="team-card" data-team-id="${team.id}" tabindex="0">
      <div class="team-logo">
        <img src="${team.logo}" alt="${team.name}" loading="lazy">
      </div>
      <h3 class="team-name">${team.name}</h3>
      <p class="team-info">${team.info}</p>
    </div>
  `;
}

// Adiciona interações aos cards de time
function addTeamCardInteractions() {
    const teamCards = document.querySelectorAll('.team-card');

    teamCards.forEach(card => {
        // Click handler
        card.addEventListener('click', function () {
            const teamId = this.dataset.teamId;
            const team = serieATeams.find(t => t.id === teamId);
            if (team) {
                showTeamDetails(team);
            }
        });

        // Keyboard navigation
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Hover effects
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Mostra detalhes do time (modal ou página)
function showTeamDetails(team) {
    // Verifica se é o Palmeiras para redirecionar para página específica
    if (team.id === 'palmeiras') {
        // Redireciona para a página do Palmeiras
        window.location.href = './palmeiras.html';
        return;
    }

    // Para outros times, mostra alert por enquanto
    alert(`Detalhes do ${team.name}\n\n${team.info}\n\nEm breve: estatísticas, jogadoras, jogos e mais informações!`);

    // Adiciona efeito visual de seleção
    const card = document.querySelector(`[data-team-id="${team.id}"]`);
    if (card) {
        card.style.border = '2px solid var(--primary-color)';
        card.style.background = 'linear-gradient(135deg, rgba(153, 42, 187, 0.05), rgba(120, 30, 150, 0.05))';

        setTimeout(() => {
            card.style.border = '';
            card.style.background = '';
        }, 2000);
    }
}

// Funcionalidade de busca
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase().trim();
        filterTeams(searchTerm);
    });
}

// Filtra times baseado na busca
function filterTeams(searchTerm) {
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab || activeTab.id !== 'brasil-content') return;

    const teamCards = document.querySelectorAll('.team-card');

    teamCards.forEach(card => {
        const teamName = card.querySelector('.team-name').textContent.toLowerCase();
        const teamInfo = card.querySelector('.team-info').textContent.toLowerCase();

        const matches = teamName.includes(searchTerm) || teamInfo.includes(searchTerm);

        card.style.display = matches ? 'block' : 'none';
        card.style.animation = matches ? 'fadeIn 0.3s ease-in-out' : 'none';
    });

    // Mostra mensagem se nenhum resultado
    const visibleCards = Array.from(teamCards).filter(card => card.style.display !== 'none');
    const noResultsMsg = document.querySelector('.no-results');

    if (visibleCards.length === 0 && searchTerm) {
        if (!noResultsMsg) {
            const msg = document.createElement('div');
            msg.className = 'no-results';
            msg.innerHTML = `
        <div class="coming-soon">
          <div class="coming-soon-icon">🔍</div>
          <h3>Nenhum time encontrado</h3>
          <p>Tente buscar por outro termo</p>
        </div>
      `;
            brasilTeamsGrid.appendChild(msg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Adiciona estilos para o efeito ripple
const style = document.createElement('style');
style.textContent = `
  .tab-btn {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .no-results {
    grid-column: 1 / -1;
    margin-top: 20px;
  }
`;
document.head.appendChild(style);

// Adiciona suporte para teclado nas abas
document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
        // Melhora a navegação por teclado
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('tab-btn')) {
            // Adiciona indicador visual para navegação por teclado
            activeElement.style.outline = '2px solid var(--primary-color)';
        }
    }
});

// Remove outline quando clica
document.addEventListener('click', function (e) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        if (btn !== e.target) {
            btn.style.outline = '';
        }
    });
});

// Função para adicionar mais times dinamicamente (para futuras expansões)
function addTeam(teamData) {
    serieATeams.push(teamData);

    // Se estivermos na aba Brasil, recarrega
    const brasilContent = document.getElementById('brasil-content');
    if (brasilContent && brasilContent.classList.contains('active')) {
        loadBrasilTeams();
    }
}

// Exporta funções para uso externo se necessário
window.TimesManager = {
    addTeam,
    showTeamDetails,
    filterTeams
};

