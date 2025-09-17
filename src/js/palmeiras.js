// ===== PÁGINA DO PALMEIRAS - JAVASCRIPT =====

// Dados das jogadoras do Palmeiras
const jogadoras = [
  {
    id: 1,
    nome: "SORRISO",
    numero: 4,
    posicao: "Zagueira",
    imagem: "../../assets/imgs/AMANDA-11.png"
  },
  {
    id: 2,
    nome: "FLÁVIA MOTA",
    numero: 16,
    posicao: "Meio-campo",
    imagem: "../../assets/imgs/AMANDA-GUTIERRES-5.png"
  },
  {
    id: 3,
    nome: "GLAUCIA",
    numero: 10,
    posicao: "Atacante",
    imagem: "../../assets/imgs/BRENA-3.png"
  },
  {
    id: 4,
    nome: "FABI SIMÕES",
    numero: 7,
    posicao: "Meio-campo",
    imagem: "../../assets/imgs/BRUNA-HIRATA-3.png"
  },
  {
    id: 5,
    nome: "DJENI",
    numero: 8,
    posicao: "Atacante",
    imagem: "../../assets/imgs/DIANY-2.png"
  },
  {
    id: 6,
    nome: "VITÓRIA ALMEIDA",
    numero: 9,
    posicao: "Atacante",
    imagem: "../../assets/imgs/FE-PALERMO-2.png"
  },
  {
    id: 7,
    nome: "POLIANA",
    numero: 11,
    posicao: "Lateral",
    imagem: "../../assets/imgs/POLIANA-4.png"
  },
  {
    id: 8,
    nome: "VITORINHA",
    numero: 15,
    posicao: "Zagueira",
    imagem: "../../assets/imgs/Vitorinha-1.png"
  },
  {
    id: 9,
    nome: "YORELI",
    numero: 20,
    posicao: "Goleira",
    imagem: "../../assets/imgs/YORELI-2.png"
  },
  {
    id: 10,
    nome: "INGRYD",
    numero: 22,
    posicao: "Meio-campo",
    imagem: "../../assets/imgs/INGRYD-1.png"
  },
  {
    id: 11,
    nome: "GI CAMPIOLO",
    numero: 25,
    posicao: "Atacante",
    imagem: "../../assets/imgs/GI-CAMPIOLO-1.png"
  },
  {
    id: 12,
    nome: "AMANDA",
    numero: 30,
    posicao: "Goleira",
    imagem: "../../assets/imgs/AMANDA-11.png"
  },
  {
    id: 13,
    nome: "BRUNA HIRATA",
    numero: 33,
    posicao: "Atacante",
    imagem: "../../assets/imgs/BRUNA-HIRATA-3.png"
  }
];

// Variáveis do carousel
let currentSlide = 0;
const playersPerSlide = 6;
const totalSlides = Math.ceil(jogadoras.length / playersPerSlide);

// Elementos DOM
let carouselContainer;
let carouselIndicators;
let prevBtn;
let nextBtn;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  initializePage();
});

function initializePage() {
  // Inicializar elementos DOM
  carouselContainer = document.getElementById('carouselContainer');
  carouselIndicators = document.getElementById('carouselIndicators');
  prevBtn = document.getElementById('prevBtn');
  nextBtn = document.getElementById('nextBtn');

  // Inicializar funcionalidades
  initializeTabs();
  initializeCarousel();
  initializeCarouselControls();
}

// ===== FUNCIONALIDADE DAS ABAS =====
function initializeTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      // Remover classe active de todos os botões e conteúdos
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Adicionar classe active ao botão clicado e conteúdo correspondente
      btn.classList.add('active');
      document.getElementById(`${targetTab}-content`).classList.add('active');
    });
  });
}

// ===== FUNCIONALIDADE DO CAROUSEL =====
function initializeCarousel() {
  renderPlayers();
  renderIndicators();
  updateCarousel();
}

function renderPlayers() {
  if (!carouselContainer) return;

  carouselContainer.innerHTML = '';
  
  jogadoras.forEach(jogadora => {
    const playerCard = createPlayerCard(jogadora);
    carouselContainer.appendChild(playerCard);
  });
}

function createPlayerCard(jogadora) {
  const card = document.createElement('div');
  card.className = 'player-card';
  
  card.innerHTML = `
    <div class="player-image">
      <img src="${jogadora.imagem}" alt="${jogadora.nome}" onerror="this.src='../../assets/imgs/logo.png'">
    </div>
    <div class="player-info">
      <h3 class="player-name">${jogadora.nome}</h3>
      <p class="player-number">${jogadora.numero}</p>
    </div>
  `;
  
  return card;
}

function renderIndicators() {
  if (!carouselIndicators) return;

  carouselIndicators.innerHTML = '';
  
  for (let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement('div');
    indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
    indicator.addEventListener('click', () => goToSlide(i));
    carouselIndicators.appendChild(indicator);
  }
}

function initializeCarouselControls() {
  if (prevBtn) {
    prevBtn.addEventListener('click', () => previousSlide());
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => nextSlide());
  }

  // Navegação por teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      previousSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  });

  // Auto-play do carousel (opcional)
  // setInterval(nextSlide, 5000);
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

function previousSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  updateCarousel();
}

function updateCarousel() {
  if (!carouselContainer) return;

  const translateX = -currentSlide * (100 / totalSlides);
  carouselContainer.style.transform = `translateX(${translateX}%)`;
  
  // Atualizar indicadores
  const indicators = document.querySelectorAll('.indicator');
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentSlide);
  });

  // Atualizar estado dos botões
  if (prevBtn && nextBtn) {
    prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
    nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
  }
}

// ===== FUNCIONALIDADES ADICIONAIS =====

// Função para buscar jogadora
function searchPlayer(query) {
  const filteredPlayers = jogadoras.filter(jogadora => 
    jogadora.nome.toLowerCase().includes(query.toLowerCase()) ||
    jogadora.numero.toString().includes(query) ||
    jogadora.posicao.toLowerCase().includes(query.toLowerCase())
  );
  
  return filteredPlayers;
}

// Função para obter estatísticas do time
function getTeamStats() {
  return {
    totalPlayers: jogadoras.length,
    positions: {
      goleiras: jogadoras.filter(p => p.posicao === 'Goleira').length,
      zagueiras: jogadoras.filter(p => p.posicao === 'Zagueira').length,
      laterais: jogadoras.filter(p => p.posicao === 'Lateral').length,
      meioCampo: jogadoras.filter(p => p.posicao === 'Meio-campo').length,
      atacantes: jogadoras.filter(p => p.posicao === 'Atacante').length
    }
  };
}

// Função para obter jogadora por número
function getPlayerByNumber(number) {
  return jogadoras.find(jogadora => jogadora.numero === number);
}

// Função para obter jogadoras por posição
function getPlayersByPosition(position) {
  return jogadoras.filter(jogadora => jogadora.posicao === position);
}

// ===== RESPONSIVIDADE =====
function handleResize() {
  // Recalcular slides baseado no tamanho da tela
  const screenWidth = window.innerWidth;
  let newPlayersPerSlide = 6;
  
  if (screenWidth <= 480) {
    newPlayersPerSlide = 1;
  } else if (screenWidth <= 768) {
    newPlayersPerSlide = 2;
  } else if (screenWidth <= 1024) {
    newPlayersPerSlide = 4;
  }
  
  // Recalcular total de slides se necessário
  const newTotalSlides = Math.ceil(jogadoras.length / newPlayersPerSlide);
  
  if (newTotalSlides !== totalSlides) {
    currentSlide = 0;
    renderIndicators();
    updateCarousel();
  }
}

// Event listener para redimensionamento
window.addEventListener('resize', handleResize);

// ===== FUNCIONALIDADES DE ACESSIBILIDADE =====
function initializeAccessibility() {
  // Adicionar suporte a navegação por teclado
  const carouselBtns = document.querySelectorAll('.carousel-btn');
  carouselBtns.forEach(btn => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Adicionar ARIA labels
  if (prevBtn) prevBtn.setAttribute('aria-label', 'Jogadora anterior');
  if (nextBtn) nextBtn.setAttribute('aria-label', 'Próxima jogadora');
  
  // Adicionar role para o carousel
  if (carouselContainer) {
    carouselContainer.setAttribute('role', 'region');
    carouselContainer.setAttribute('aria-label', 'Elenco de jogadoras do Palmeiras');
  }
}

// Inicializar acessibilidade
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// ===== EXPORTAR FUNÇÕES PARA USO GLOBAL =====
window.PalmeirasPage = {
  nextSlide,
  previousSlide,
  goToSlide,
  searchPlayer,
  getTeamStats,
  getPlayerByNumber,
  getPlayersByPosition
};
