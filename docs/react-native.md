# React Native — Escopo e Plano (MVP + evolução)

Objetivo
- Disponibilizar app mobile com paridade funcional progressiva com a web, priorizando autenticação, feed, comunidade e times.

Arquitetura
- RN com TypeScript, React Navigation, Axios/Fetch, Zustand/Redux (a confirmar).
- Modularização por features: auth, feed, posts, comments, teams.
- Theming/Design System compartilhável (tokens) com a web quando possível.

Paridade de funcionalidades
- MVP
  - Autenticação: login/cadastro/recuperação.
  - Feed (Home): lista de conteúdos/posts, detalhe.
  - Comunidade: criar post (texto/imagem), curtir e comentar.
  - Times: lista e detalhe.
  - Tratamento de erros e mensagens amigáveis.
- P1/P2
  - Perfil básico, seguir times/jogadoras, notificações in-app.
  - Compartilhamento nativo.
  - Gamificação básica.

Requisitos não funcionais
- Performance: listas com FlatList/SectionList, renderização virtualizada.
- Acessibilidade: rotulagem (accessibilityLabel), navegação por leitor de tela.
- Offline-first parcial: cache básico (Query/AsyncStorage) para feed.
- Observabilidade: captura de erros (Sentry/alternativa) e analytics.

Roteamento
- Stacks: AuthStack (Login, Register, Forgot), AppStack (Home, Times, Comunidade, Perfil).
- Deep links: passa-bola://post/:id, passa-bola://team/:id.

Integrações
- Upload de mídia: limitar tamanho e formatos; compressão.
- Push notifications (evolução): Expo Notifications/Firebase.

Build e distribuição
- Expo (preferencial) para acelerar setup e distribuição.
- Ambientes: dev, staging (opcional), produção.

Critérios de aceite
- Fluxos de login/cadastro/recuperação funcionam em iOS e Android.
- Scroll suave e responsivo nas listas; estados vazio/erro/loading claros.
- Erros não tratados não aparecem no console.
- Deep link abre telas corretas.

Roadmap sugerido
- Sprint A: setup RN (Expo), navegação, tema, auth.
- Sprint B: Home/Feed e Posts (leitura e criação).
- Sprint C: Times e Comentários, erros e analytics.
- Sprint D: perfil básico e polimento; testes de usabilidade.
