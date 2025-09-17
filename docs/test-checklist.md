# Checklist de Testes Unitários (MVP)

Meta mínima
- 70%+ cobertura em linhas/branches nas camadas críticas.

Escopos
- Validações de formulário
  - E-mail válido/inválido, senha forte/fraca, mensagens de erro.
- Cliente HTTP
  - Adiciona Authorization quando autenticado.
  - Trata 401/403 com redirecionamento/logout.
  - Timeouts e retries idempotentes.
- Roteamento protegido
  - Bloqueia acesso a rotas privadas sem token.
  - Redireciona para login e preserva rota de retorno.
- Store/estado (se aplicável)
  - Ações de login/logout atualizam o estado corretamente.
  - Atualização otimista de likes e contadores.
- Componentes
  - Form de login: validações e submissão feliz/triste.
  - Editor de post: upload inválido, limite de tamanho, publicação.
  - Lista de posts: paginação/scroll, estados vazio/erro/loading.
- Utilitários
  - Normalização de erros (network/validation/server) → mensagens amigáveis.

Boas práticas
- Independência: sem dependência de rede real.
- Dados determinísticos: fixtures/factories.
- Snapshot testing apenas para componentes estáveis.
- Executar em CI local `npm test` com saída não interativa.
