# Página de Times - Passa a Bola

## Visão Geral

A página de times foi criada com um design moderno e interativo, apresentando um mosaico de times organizados em abas para Brasil e Internacional.

## Funcionalidades Implementadas

### 🎯 Abas Interativas
- **Aba Brasil**: Mostra os times da Série A do futebol feminino brasileiro
- **Aba Internacional**: Preparada para futuras expansões com times internacionais
- Transição suave entre abas com animações CSS
- Efeito ripple nos botões das abas

### 🏆 Mosaico de Times
- Grid responsivo com cards dos times
- Efeitos hover interativos:
  - Elevação do card
  - Mudança de cor dos elementos
  - Efeito de shimmer (brilho)
  - Escala do logo do time
- Loading spinner durante carregamento
- Design responsivo para mobile, tablet e desktop

### 🔍 Funcionalidade de Busca
- Busca em tempo real por nome do time ou informações
- Filtragem instantânea dos resultados
- Mensagem quando nenhum resultado é encontrado
- Suporte a navegação por teclado

### ♿ Acessibilidade
- Navegação por teclado completa
- Estados de foco visíveis
- Suporte a screen readers
- Respeita preferências de movimento reduzido

## Estrutura de Arquivos

```
src/
├── html/
│   └── times.html          # Página principal de times
├── css/
│   └── times.css           # Estilos específicos da página
└── js/
    └── times.js            # Funcionalidades JavaScript
```

## Times Incluídos (Série A)

1. América-MG
2. Bahia
3. Corinthians
4. Flamengo
5. Fluminense
6. Grêmio
7. Internacional
8. Juventude
9. Palmeiras
10. Red Bull Bragantino
11. São Paulo
12. Sport Recife

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Animações, gradientes, grid layout, flexbox
- **JavaScript ES6+**: Funcionalidades interativas
- **Design Responsivo**: Mobile-first approach

## Próximas Funcionalidades

- [ ] Modal com detalhes completos do time
- [ ] Estatísticas e informações dos times
- [ ] Times internacionais (Europa, América do Sul, etc.)
- [ ] Filtros por região ou liga
- [ ] Integração com API de dados dos times
- [ ] Favoritos de times
- [ ] Compartilhamento de times

## Compatibilidade

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers

## Instalação e Uso

1. A página está pronta para uso imediatamente
2. Navegue para `src/html/times.html`
3. Todas as funcionalidades estão ativas por padrão
4. Os links de navegação foram atualizados em todas as páginas

## Personalização

Para adicionar novos times, edite o array `serieATeams` no arquivo `src/js/times.js`:

```javascript
const serieATeams = [
  {
    id: 'novo-time',
    name: 'Novo Time',
    logo: 'caminho/para/logo.svg',
    info: 'Informações do time'
  },
  // ... outros times
];
```

