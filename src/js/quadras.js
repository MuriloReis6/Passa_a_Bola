// Configurações
const SAO_PAULO_CENTER = [-23.5505, -46.6333];
const MAP_ZOOM = 11;

// Elementos DOM
const mapEl = document.getElementById('map');
const quadrasGridEl = document.getElementById('quadrasGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const districtFilter = document.getElementById('districtFilter');
const typeFilter = document.getElementById('typeFilter');
const priceFilter = document.getElementById('priceFilter');
const availabilityFilter = document.getElementById('availabilityFilter');
const centerMapBtn = document.getElementById('centerMap');
const toggleViewBtn = document.getElementById('toggleView');
const viewBtns = document.querySelectorAll('.view-btn');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');

// Elementos do Header
const hamburgerMenu = document.getElementById('hamburgerMenu');
const sidebarMenu = document.getElementById('sidebarMenu');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const closeMenu = document.getElementById('closeMenu');
const fixedLogo = document.getElementById('fixedLogo');

// Variáveis globais
let map;
let markers = [];
let currentView = 'grid';
let selectedQuadra = null;

// Dados das quadras
const quadrasData = [
  {
    id: 1,
    name: "Quadra do Corinthians",
    type: "society",
    district: "centro",
    address: "Rua São Jorge, 777 - Centro",
    price: 80,
    priceType: "hour",
    coordinates: [-23.5505, -46.6333],
    phone: "(11) 99999-9999",
    facilities: ["Vestiário", "Estacionamento", "Lanchonete"],
    availability: "available",
    rating: 4.8,
    image: "../../assets/imgs/logo-corinthians-1024 (1).png",
    description: "Quadra oficial do Corinthians com gramado sintético de alta qualidade."
  },
  {
    id: 2,
    name: "Campo da Vila Madalena",
    type: "campo",
    district: "vila-madalena",
    address: "Rua Harmonia, 123 - Vila Madalena",
    price: 120,
    priceType: "hour",
    coordinates: [-23.5489, -46.6918],
    phone: "(11) 99999-8888",
    facilities: ["Vestiário", "Estacionamento", "Bar"],
    availability: "today",
    rating: 4.6,
    image: "../../assets/imgs/logo-palmeiras-1024.png",
    description: "Campo de grama natural no coração da Vila Madalena."
  },
  {
    id: 3,
    name: "Futsal Pinheiros",
    type: "futsal",
    district: "pinheiros",
    address: "Av. Brigadeiro Faria Lima, 2000 - Pinheiros",
    price: 60,
    priceType: "hour",
    coordinates: [-23.5687, -46.6934],
    phone: "(11) 99999-7777",
    facilities: ["Vestiário", "Estacionamento"],
    availability: "available",
    rating: 4.5,
    image: "../../assets/imgs/logo-sao-paulo-1024.png",
    description: "Quadra de futsal coberta com piso profissional."
  },
  {
    id: 4,
    name: "Society Jardins",
    type: "society",
    district: "jardins",
    address: "Rua Oscar Freire, 500 - Jardins",
    price: 100,
    priceType: "hour",
    coordinates: [-23.5615, -46.6565],
    phone: "(11) 99999-6666",
    facilities: ["Vestiário", "Estacionamento", "Lanchonete", "WiFi"],
    availability: "weekend",
    rating: 4.9,
    image: "../../assets/imgs/logo-selecao-brasileira-brasil-novo-logo-2019-1024.png",
    description: "Society premium no coração dos Jardins com todas as comodidades."
  },
  {
    id: 5,
    name: "Campo Itaquera",
    type: "campo",
    district: "itaquera",
    address: "Av. Itaquera, 3000 - Itaquera",
    price: 70,
    priceType: "hour",
    coordinates: [-23.5405, -46.4742],
    phone: "(11) 99999-5555",
    facilities: ["Vestiário", "Estacionamento"],
    availability: "available",
    rating: 4.3,
    image: "../../assets/imgs/logo-cruzeiro-1024 (1).png",
    description: "Campo de grama natural na Zona Leste de São Paulo."
  },
  {
    id: 6,
    name: "Futsal Santo André",
    type: "futsal",
    district: "santo-andre",
    address: "Rua das Flores, 100 - Santo André",
    price: 50,
    priceType: "hour",
    coordinates: [-23.6637, -46.5382],
    phone: "(11) 99999-4444",
    facilities: ["Vestiário"],
    availability: "today",
    rating: 4.4,
    image: "../../assets/imgs/brasileirao.png",
    description: "Quadra de futsal com piso de madeira profissional."
  },
  {
    id: 7,
    name: "Society São Bernardo",
    type: "society",
    district: "sao-bernardo",
    address: "Av. Kennedy, 1500 - São Bernardo",
    price: 90,
    priceType: "hour",
    coordinates: [-23.6939, -46.5650],
    phone: "(11) 99999-3333",
    facilities: ["Vestiário", "Estacionamento", "Lanchonete"],
    availability: "weekend",
    rating: 4.7,
    image: "../../assets/imgs/logo-palmeiras-1024.png",
    description: "Society com gramado sintético de última geração."
  },
  {
    id: 8,
    name: "Campo Gratuito Centro",
    type: "campo",
    district: "centro",
    address: "Parque Ibirapuera - Centro",
    price: 0,
    priceType: "free",
    coordinates: [-23.5874, -46.6576],
    phone: "(11) 99999-2222",
    facilities: ["Vestiário"],
    availability: "available",
    rating: 4.2,
    image: "../../assets/imgs/logo-selecao-brasileira-brasil-novo-logo-2019-1024.png",
    description: "Campo público gratuito no Parque Ibirapuera."
  }
];

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
  initializeHeader();
  initializeMap();
  initializeFilters();
  initializeSearch();
  renderQuadras(quadrasData);
  addMarkersToMap(quadrasData);
});

// Funcionalidades do Header
function initializeHeader() {
  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', toggleSidebar);
  }

  if (closeMenu) {
    closeMenu.addEventListener('click', closeSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

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

// Inicialização do Mapa
function initializeMap() {
  map = L.map('map').setView(SAO_PAULO_CENTER, MAP_ZOOM);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Controles do mapa
  if (centerMapBtn) {
    centerMapBtn.addEventListener('click', () => {
      map.setView(SAO_PAULO_CENTER, MAP_ZOOM);
    });
  }

  if (toggleViewBtn) {
    toggleViewBtn.addEventListener('click', toggleMapView);
  }
}

// Adicionar marcadores ao mapa
function addMarkersToMap(quadras) {
  // Limpar marcadores existentes
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  quadras.forEach(quadra => {
    // Criar ícone roxo personalizado
    const purpleIcon = L.divIcon({
      className: 'custom-purple-marker',
      html: '<div class="purple-marker"></div>',
      iconSize: [25, 25],
      iconAnchor: [12, 12]
    });

    const marker = L.marker(quadra.coordinates, { icon: purpleIcon })
      .addTo(map)
      .bindPopup(`
        <div class="map-popup">
          <h3>${quadra.name}</h3>
          <p><strong>Tipo:</strong> ${getTypeLabel(quadra.type)}</p>
          <p><strong>Preço:</strong> ${formatPrice(quadra.price, quadra.priceType)}</p>
          <p><strong>Endereço:</strong> ${quadra.address}</p>
          <button onclick="selectQuadra(${quadra.id})" class="popup-btn">Ver Detalhes</button>
        </div>
      `);

    marker.quadraId = quadra.id;
    markers.push(marker);
  });
}

// Selecionar quadra
function selectQuadra(quadraId) {
  const quadra = quadrasData.find(q => q.id === quadraId);
  if (quadra) {
    selectedQuadra = quadra;
    showQuadraDetails(quadra);

    // Centralizar mapa na quadra
    map.setView(quadra.coordinates, 15);

    // Destacar card na lista
    document.querySelectorAll('.quadra-card').forEach(card => {
      card.classList.remove('selected');
    });

    const card = document.querySelector(`[data-quadra-id="${quadraId}"]`);
    if (card) {
      card.classList.add('selected');
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

// Mostrar detalhes da quadra
function showQuadraDetails(quadra) {
  modalBody.innerHTML = `
    <div class="quadra-details">
      <div class="details-header">
        <h2>${quadra.name}</h2>
        <div class="quadra-type">${getTypeLabel(quadra.type)}</div>
      </div>
      
      <div class="details-image">
        <img src="${quadra.image}" alt="${quadra.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
      </div>
      
      <div class="details-info">
        <div class="info-section">
          <h3>Informações</h3>
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>${quadra.address}</span>
          </div>
          <div class="info-item">
            <i class="fas fa-phone"></i>
            <span>${quadra.phone}</span>
          </div>
          <div class="info-item">
            <i class="fas fa-star"></i>
            <span>${quadra.rating}/5.0</span>
          </div>
        </div>
        
        <div class="info-section">
          <h3>Preço</h3>
          <div class="price-display">
            <span class="price-value">${formatPrice(quadra.price, quadra.priceType)}</span>
          </div>
        </div>
        
        <div class="info-section">
          <h3>Comodidades</h3>
          <div class="facilities">
            ${quadra.facilities.map(facility => `
              <span class="facility-tag">
                <i class="fas fa-check"></i>
                ${facility}
              </span>
            `).join('')}
          </div>
        </div>
        
        <div class="info-section">
          <h3>Descrição</h3>
          <p>${quadra.description}</p>
        </div>
        
        <div class="details-actions">
          <button class="action-btn primary" onclick="reserveQuadra(${quadra.id})">
            <i class="fas fa-calendar-plus"></i>
            Reservar
          </button>
          <button class="action-btn secondary" onclick="shareQuadra(${quadra.id})">
            <i class="fas fa-share"></i>
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');
}

// Fechar modal
if (modalClose) {
  modalClose.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
  });
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });
}

// Inicializar filtros
function initializeFilters() {
  const filters = [districtFilter, typeFilter, priceFilter, availabilityFilter];

  filters.forEach(filter => {
    if (filter) {
      filter.addEventListener('change', applyFilters);
    }
  });
}

// Aplicar filtros
function applyFilters() {
  const district = districtFilter?.value || 'all';
  const type = typeFilter?.value || 'all';
  const price = priceFilter?.value || 'all';
  const availability = availabilityFilter?.value || 'all';

  let filteredQuadras = quadrasData.filter(quadra => {
    const districtMatch = district === 'all' || quadra.district === district;
    const typeMatch = type === 'all' || quadra.type === type;
    const priceMatch = price === 'all' || checkPriceFilter(quadra, price);
    const availabilityMatch = availability === 'all' || quadra.availability === availability;

    return districtMatch && typeMatch && priceMatch && availabilityMatch;
  });

  renderQuadras(filteredQuadras);
  addMarkersToMap(filteredQuadras);
}

// Verificar filtro de preço
function checkPriceFilter(quadra, priceFilter) {
  switch (priceFilter) {
    case 'free':
      return quadra.price === 0;
    case 'low':
      return quadra.price > 0 && quadra.price <= 50;
    case 'medium':
      return quadra.price > 50 && quadra.price <= 100;
    case 'high':
      return quadra.price > 100;
    default:
      return true;
  }
}

// Inicializar busca
function initializeSearch() {
  if (searchInput && searchBtn) {
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });

    searchInput.addEventListener('input', debounce(performSearch, 300));
  }
}

// Realizar busca
function performSearch() {
  const query = searchInput.value.toLowerCase().trim();

  if (!query) {
    applyFilters();
    return;
  }

  const filtered = quadrasData.filter(quadra =>
    quadra.name.toLowerCase().includes(query) ||
    quadra.address.toLowerCase().includes(query) ||
    quadra.district.toLowerCase().includes(query)
  );

  renderQuadras(filtered);
  addMarkersToMap(filtered);
}

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

// Renderizar quadras
function renderQuadras(quadras) {
  if (!quadrasGridEl) return;

  if (quadras.length === 0) {
    quadrasGridEl.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🏟️</div>
        <h3>Nenhuma quadra encontrada</h3>
        <p>Tente ajustar os filtros ou buscar por outros termos</p>
      </div>
    `;
    return;
  }

  const viewClass = currentView === 'list' ? 'list-view' : 'grid-view';
  quadrasGridEl.className = `quadras-grid ${viewClass}`;

  quadrasGridEl.innerHTML = quadras.map(quadra => `
    <div class="quadra-card" data-quadra-id="${quadra.id}" onclick="selectQuadra(${quadra.id})">
      <div class="quadra-header">
        <div>
          <div class="quadra-name">${quadra.name}</div>
          <div class="quadra-info-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>${quadra.district}</span>
          </div>
        </div>
        <div class="quadra-type">${getTypeLabel(quadra.type)}</div>
      </div>
      
      <div class="quadra-info">
        <div class="quadra-info-item">
          <i class="fas fa-map-marker-alt"></i>
          <span>${quadra.address}</span>
        </div>
        <div class="quadra-info-item">
          <i class="fas fa-phone"></i>
          <span>${quadra.phone}</span>
        </div>
        <div class="quadra-info-item">
          <i class="fas fa-star"></i>
          <span>${quadra.rating}/5.0</span>
        </div>
        <div class="quadra-info-item">
          <i class="fas fa-clock"></i>
          <span>${getAvailabilityLabel(quadra.availability)}</span>
        </div>
      </div>
      
      <div class="quadra-price">${formatPrice(quadra.price, quadra.priceType)}</div>
      
      <div class="quadra-actions">
        <button class="quadra-btn primary" onclick="event.stopPropagation(); reserveQuadra(${quadra.id})">
          <i class="fas fa-calendar-plus"></i>
          Reservar
        </button>
        <button class="quadra-btn" onclick="event.stopPropagation(); showQuadraDetails(${quadrasData.find(q => q.id === quadra.id)})">
          <i class="fas fa-info-circle"></i>
          Detalhes
        </button>
      </div>
    </div>
  `).join('');
}

// Alternar visualização
viewBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    viewBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentView = btn.dataset.view;

    const currentQuadras = getCurrentFilteredQuadras();
    renderQuadras(currentQuadras);
  });
});

// Obter quadras filtradas atuais
function getCurrentFilteredQuadras() {
  const district = districtFilter?.value || 'all';
  const type = typeFilter?.value || 'all';
  const price = priceFilter?.value || 'all';
  const availability = availabilityFilter?.value || 'all';
  const query = searchInput?.value.toLowerCase().trim() || '';

  return quadrasData.filter(quadra => {
    const districtMatch = district === 'all' || quadra.district === district;
    const typeMatch = type === 'all' || quadra.type === type;
    const priceMatch = price === 'all' || checkPriceFilter(quadra, price);
    const availabilityMatch = availability === 'all' || quadra.availability === availability;
    const searchMatch = !query ||
      quadra.name.toLowerCase().includes(query) ||
      quadra.address.toLowerCase().includes(query) ||
      quadra.district.toLowerCase().includes(query);

    return districtMatch && typeMatch && priceMatch && availabilityMatch && searchMatch;
  });
}

// Alternar visualização do mapa
function toggleMapView() {
  // Implementar alternância entre mapa e lista
  const contentLayout = document.querySelector('.content-layout');
  if (contentLayout) {
    contentLayout.classList.toggle('map-hidden');
  }
}

// Funções auxiliares
function getTypeLabel(type) {
  const types = {
    'society': 'Society',
    'futsal': 'Futsal',
    'campo': 'Campo'
  };
  return types[type] || type;
}

function getAvailabilityLabel(availability) {
  const labels = {
    'available': 'Disponível agora',
    'today': 'Disponível hoje',
    'weekend': 'Fim de semana'
  };
  return labels[availability] || availability;
}

function formatPrice(price, type) {
  if (price === 0) return 'Gratuito';
  if (type === 'free') return 'Gratuito';
  return `R$ ${price.toFixed(2)}/hora`;
}

// Funções de ação
function reserveQuadra(quadraId) {
  const quadra = quadrasData.find(q => q.id === quadraId);
  if (quadra) {
    alert(`Reserva para ${quadra.name}!\n\nEm uma implementação real, isso abriria um sistema de reservas.`);
  }
}

function shareQuadra(quadraId) {
  const quadra = quadrasData.find(q => q.id === quadraId);
  if (quadra && navigator.share) {
    navigator.share({
      title: quadra.name,
      text: `Confira esta quadra: ${quadra.name}`,
      url: window.location.href
    });
  } else {
    // Fallback para copiar link
    navigator.clipboard.writeText(window.location.href);
    alert('Link copiado para a área de transferência!');
  }
}

// Funcionalidades de acessibilidade
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeSidebar();
    modalOverlay.classList.remove('active');
  }
});

// Adicionar estilos para o popup do mapa e marcadores roxos
const style = document.createElement('style');
style.textContent = `
  .map-popup {
    min-width: 200px;
  }
  
  .map-popup h3 {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
    color: var(--text);
  }
  
  .map-popup p {
    margin: 4px 0;
    font-size: 0.9rem;
    color: var(--text-muted);
  }
  
  .popup-btn {
    background: var(--accent);
    color: var(--white);
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    margin-top: 8px;
    width: 100%;
  }
  
  .popup-btn:hover {
    background: var(--cbf-dark);
  }
  
  /* Marcador roxo personalizado */
  .custom-purple-marker {
    background: transparent !important;
    border: none !important;
  }
  
  .purple-marker {
    width: 25px;
    height: 25px;
    background: linear-gradient(135deg, #992abb 0%, #781e96 100%);
    border: 3px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(153, 42, 187, 0.4);
    position: relative;
    animation: pulse 2s infinite;
  }
  
  .purple-marker::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  }
  
  .purple-marker::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 35px;
    height: 35px;
    background: rgba(153, 42, 187, 0.2);
    border-radius: 50%;
    animation: ripple 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 4px 12px rgba(153, 42, 187, 0.4);
    }
    50% {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(153, 42, 187, 0.6);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 4px 12px rgba(153, 42, 187, 0.4);
    }
  }
  
  @keyframes ripple {
    0% {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.4);
      opacity: 0;
    }
  }
  
  .quadra-details {
    max-width: 100%;
  }
  
  .details-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }
  
  .details-header h2 {
    margin: 0;
    color: var(--text);
  }
  
  .details-image {
    margin-bottom: 20px;
  }
  
  .info-section {
    margin-bottom: 20px;
  }
  
  .info-section h3 {
    margin-bottom: 12px;
    color: var(--text);
    font-size: 1.1rem;
  }
  
  .info-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    color: var(--text-muted);
  }
  
  .info-item i {
    width: 16px;
    color: var(--accent);
  }
  
  .price-display {
    background: var(--gray-50);
    padding: 12px;
    border-radius: 8px;
    text-align: center;
  }
  
  .price-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--success);
  }
  
  .facilities {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .facility-tag {
    background: var(--gray-100);
    color: var(--text);
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .facility-tag i {
    color: var(--success);
  }
  
  .details-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }
  
  .action-btn {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid var(--card-border);
    border-radius: 8px;
    background: var(--white);
    color: var(--text);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .action-btn.primary {
    background: var(--accent);
    color: var(--white);
    border-color: var(--accent);
  }
  
  .action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .action-btn.primary:hover {
    background: var(--cbf-dark);
    border-color: var(--cbf-dark);
  }
  
  .no-results {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-muted);
  }
  
  .no-results-icon {
    font-size: 3rem;
    margin-bottom: 16px;
  }
  
  .no-results h3 {
    margin-bottom: 8px;
    color: var(--text);
  }
`;
document.head.appendChild(style);
