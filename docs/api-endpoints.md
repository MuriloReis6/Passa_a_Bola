# API Endpoints (MVP)

Base URL
- Web dev: http://localhost:3000 (frontend)
- API dev: http://localhost:4000 (exemplo)

## Autenticação
- POST /auth/register
  - body: { name, email, password }
  - 201 Created → { id, name, email }
  - 400 ValidationError
- POST /auth/login
  - body: { email, password }
  - 200 OK → { token, user: { id, name, email } }
  - 401 Unauthorized
- POST /auth/forgot-password
  - body: { email }
  - 204 No Content
- POST /auth/reset-password
  - body: { token, newPassword }
  - 204 No Content

## Usuários
- GET /users/me (auth)
  - 200 OK → { id, name, email, avatarUrl, bio }
- PATCH /users/me (auth)
  - body: { name?, avatarUrl?, bio? }
  - 200 OK → atualizado

## Posts
- GET /posts
  - query: page, pageSize
  - 200 OK → [{ id, author, text, mediaUrl, likes, commentsCount, createdAt }]
- POST /posts (auth)
  - body: { text, mediaUrl? }
  - 201 Created → { id }
- GET /posts/:id
  - 200 OK → { id, author, text, mediaUrl, likes, createdAt, comments: [...] }
- DELETE /posts/:id (auth, owner/mod)
  - 204 No Content
- POST /posts/:id/like (auth)
  - 204 No Content
- DELETE /posts/:id/like (auth)
  - 204 No Content
- POST /posts/:id/report (auth)
  - body: { reason }
  - 202 Accepted

## Comentários
- POST /posts/:id/comments (auth)
  - body: { text }
  - 201 Created → { id }
- DELETE /comments/:id (auth, owner/mod)
  - 204 No Content

## Times
- GET /teams
  - 200 OK → [{ id, name, crestUrl, league }]
- GET /teams/:id
  - 200 OK → { id, name, crestUrl, league, roster: [...], news: [...] }

## Jogos (Mock API neste projeto)
- GET /assets/api/matches.json
  - 200 OK → { updatedAt, matches: [
    { id, league, stage?, round?, status, minute, startTime, venue,
      broadcasters?: string[], referee?: string|null,
      homeTeam: { name, crestUrl }, awayTeam: { name, crestUrl },
      score: { home, away },
      lastEvent?: { type: 'goal'|'card'|'sub'|'end', team?, player?, minute? },
      timeline?: [{ minute, type, team?, player? }],
      stats?: { possession: { home, away }, shots: { home, away }, shotsOnTarget: { home, away }, corners: { home, away }, fouls: { home, away } }
    }
  ] }
- Observações
  - Use cache-busting (query ?t=timestamp) e polling periódico para atualizações.
  - Campos stage/round/broadcasters/referee, lastEvent, timeline e stats são opcionais.

## Erros
- Formato
  - { error: { code, message, details? } }
- Códigos comuns
  - 400, 401, 403, 404, 409, 422, 429, 500

## Segurança
- Autorização: Bearer token no header Authorization.
- Rate limit recomendado em endpoints de escrita.
