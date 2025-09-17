// Torneios - gerenciamento local (localStorage)
(function(){
  const ENABLE_TOASTS = false; // desabilita notificações visuais nesta página
  const STORAGE_KEY = 'passa_bola_tournaments_v1';

  /**
   * Estruturas
   * Tournament { id, name, type, teams: Team[], matches: Match[][], createdAt, updatedAt }
   * Team { id, name, color }
   * Match { id, roundIndex, teamAId, teamBId, scoreA, scoreB, status: 'scheduled'|'live'|'finished' }
   */

  const uid = () => Math.random().toString(36).slice(2, 10);

  const store = {
    read(){
      try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }catch(e){ return []; }
    },
    write(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  };

  let tournaments = store.read();
  let currentId = null;

  // Elements
  const els = {
    list: document.getElementById('tournamentsList'),
    emptyState: document.getElementById('emptyState'),
    view: document.getElementById('tournamentView'),
    name: document.getElementById('tournamentName'),
    type: document.getElementById('tournamentType'),
    teamsList: document.getElementById('teamsList'),
    bracket: document.getElementById('bracket'),
    matches: document.getElementById('matches'),
    newBtn: document.getElementById('newTournamentBtn'),
    emptyNewBtn: document.getElementById('emptyNewBtn'),
    addTeamBtn: document.getElementById('addTeamBtn'),
    genBracketBtn: document.getElementById('generateBracketBtn'),
    importBtn: document.getElementById('importBtn'),
    exportBtn: document.getElementById('exportBtn'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    importInput: document.getElementById('importInput'),
    toaster: document.getElementById('toaster'),
    statT: document.getElementById('statTournaments'),
    statTeams: document.getElementById('statTeams'),
    statMatches: document.getElementById('statMatches')
  };

  function save(){
    tournaments = tournaments.map(t => t.id === currentId ? { ...t, updatedAt: Date.now() } : t);
    store.write(tournaments);
    renderList();
    updateStats();
    toast('Alterações salvas', 'success');
  }

  function createTournament(){
    const t = {
      id: uid(),
      name: 'Novo Torneio',
      type: 'single',
      teams: [],
      matches: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    tournaments.unshift(t);
    currentId = t.id;
    store.write(tournaments);
    renderList();
    openTournament(t.id);
  }

  function deleteTournament(id){
    tournaments = tournaments.filter(t => t.id !== id);
    if(currentId === id) currentId = null;
    store.write(tournaments);
    renderList();
    showEmpty();
    updateStats();
    toast('Torneio excluído', 'success');
  }

  function openTournament(id){
    currentId = id;
    const t = tournaments.find(x => x.id === id);
    if(!t){ showEmpty(); return; }
    els.emptyState.classList.add('hidden');
    els.view.classList.remove('hidden');
    els.name.value = t.name;
    els.type.value = t.type;
    renderTeams(t);
    renderBracket(t);
    renderMatches(t);
    highlightActiveInList();
    updateStats();
  }

  function showEmpty(){
    els.view.classList.add('hidden');
    els.emptyState.classList.remove('hidden');
    highlightActiveInList();
  }

  function renderList(){
    els.list.innerHTML = '';
    tournaments.forEach(t => {
      const li = document.createElement('li');
      li.className = 'tournament-item';
      li.innerHTML = `
        <div>
          <div class="name">${escapeHtml(t.name)}</div>
          <div class="meta">${formatDate(t.updatedAt)}</div>
        </div>
        <div class="actions">
          <button data-action="open">Abrir</button>
          <button data-action="delete">Excluir</button>
        </div>
      `;
      li.addEventListener('click', (e) => {
        const action = e.target.getAttribute && e.target.getAttribute('data-action');
        if(action === 'delete'){
          e.stopPropagation();
          if(confirm('Excluir este torneio?')) deleteTournament(t.id);
          return;
        }
        openTournament(t.id);
      });
      li.dataset.id = t.id;
      els.list.appendChild(li);
    });
    highlightActiveInList();
    updateStats();
  }

  function highlightActiveInList(){
    Array.from(els.list.children).forEach(li => {
      li.style.outline = li.dataset.id === currentId ? '2px solid var(--cbf-yellow)' : 'none';
    });
  }

  // Teams
  function renderTeams(t){
    els.teamsList.innerHTML = '';
    t.teams.forEach(team => {
      const li = document.createElement('li');
      li.className = 'team-row';
      li.innerHTML = `
        <div class="team-color" style="background:${team.color}"></div>
        <div class="team-name">${escapeHtml(team.name)}</div>
        <div class="team-actions">
          <button data-action="rename">Renomear</button>
          <button data-action="remove">Remover</button>
        </div>
      `;
      li.addEventListener('click', (e) => {
        const action = e.target.getAttribute && e.target.getAttribute('data-action');
        if(action === 'rename'){
          const name = prompt('Novo nome da equipe:', team.name);
          if(name){ team.name = name; save(); openTournament(t.id); }
        } else if(action === 'remove'){
          if(confirm('Remover equipe?')){
            t.teams = t.teams.filter(x => x.id !== team.id);
            save(); openTournament(t.id);
          }
        }
      });
      els.teamsList.appendChild(li);
    });

    const form = document.createElement('div');
    form.className = 'add-team-form';
    form.innerHTML = `
      <input id="newTeamName" placeholder="Nome da equipe" />
      <input id="newTeamColor" type="color" value="#6bca3f"/>
      <button id="createTeamBtn" class="secondary-btn">Adicionar</button>
    `;
    form.querySelector('#createTeamBtn').addEventListener('click', () => {
      const name = form.querySelector('#newTeamName').value.trim();
      const color = form.querySelector('#newTeamColor').value;
      if(!name){ alert('Informe o nome da equipe'); return; }
      t.teams.push({ id: uid(), name, color });
      save(); openTournament(t.id);
    });
    els.teamsList.appendChild(form);
  }

  // Bracket
  function renderBracket(t){
    els.bracket.innerHTML = '';
    if(!t.matches || t.matches.length === 0){
      const tip = document.createElement('div');
      tip.className = 'empty-state';
      tip.innerHTML = '<div class="empty-emoji">🧩</div><p>Gere o chaveamento para ver as partidas.</p>';
      els.bracket.appendChild(tip);
      return;
    }
    t.matches.forEach((round, rIndex) => {
      const col = document.createElement('div');
      col.className = 'round';
      round.forEach(m => {
        const teamA = t.teams.find(x => x.id === m.teamAId);
        const teamB = t.teams.find(x => x.id === m.teamBId);
        const card = document.createElement('div');
        card.className = 'match';
        card.innerHTML = `
          <div class="row">
            <div class="team"><span style="width:10px;height:10px;border-radius:50%;background:${teamA?.color || '#ddd'}"></span><span>${escapeHtml(teamA?.name || 'TBD')}</span></div>
            <input class="score" data-id="${m.id}" data-side="A" value="${m.scoreA ?? ''}" />
          </div>
          <div class="row">
            <div class="team"><span style="width:10px;height:10px;border-radius:50%;background:${teamB?.color || '#ddd'}"></span><span>${escapeHtml(teamB?.name || 'TBD')}</span></div>
            <input class="score" data-id="${m.id}" data-side="B" value="${m.scoreB ?? ''}" />
          </div>
          <div class="status">${badge(m.status)}</div>
        `;
        col.appendChild(card);
      });
      els.bracket.appendChild(col);
    });

    // Bind score inputs
    els.bracket.querySelectorAll('.score').forEach(inp => {
      inp.addEventListener('change', onScoreChange);
    });
  }

  function onScoreChange(e){
    const id = e.target.getAttribute('data-id');
    const side = e.target.getAttribute('data-side');
    const value = e.target.value === '' ? null : Number(e.target.value);
    const t = tournaments.find(x => x.id === currentId);
    if(!t) return;
    for(const round of t.matches){
      for(const m of round){
        if(m.id === id){
          if(side === 'A') m.scoreA = value; else m.scoreB = value;
          // update status
          if(m.scoreA != null && m.scoreB != null) m.status = 'finished';
          else if(m.scoreA != null || m.scoreB != null) m.status = 'live';
          else m.status = 'scheduled';
        }
      }
    }
    propagateWinners(t);
    save();
    renderBracket(t);
    renderMatches(t);
  }

  function renderMatches(t){
    els.matches.innerHTML = '';
    const flat = t.matches.flat();
    if(flat.length === 0){
      const tip = document.createElement('div');
      tip.className = 'empty-state';
      tip.innerHTML = '<div class="empty-emoji">📅</div><p>Nenhum jogo gerado ainda.</p>';
      els.matches.appendChild(tip);
      return;
    }
    flat.forEach(m => {
      const teamA = t.teams.find(x => x.id === m.teamAId);
      const teamB = t.teams.find(x => x.id === m.teamBId);
      const div = document.createElement('div');
      div.className = 'match-item';
      div.innerHTML = `
        <div class="header">
          <strong>${escapeHtml(teamA?.name || 'TBD')} x ${escapeHtml(teamB?.name || 'TBD')}</strong>
          <span class="badge ${m.status}">${m.status}</span>
        </div>
        <div>${fmtScore(m)}</div>
      `;
      els.matches.appendChild(div);
    });
  }

  function fmtScore(m){
    const a = m.scoreA != null ? m.scoreA : '-';
    const b = m.scoreB != null ? m.scoreB : '-';
    return `${a} x ${b}`;
  }

  function badge(status){
    return `<span class="badge ${status}">${status}</span>`;
  }

  function generateBracket(){
    const t = tournaments.find(x => x.id === currentId);
    if(!t) return;
    if(t.teams.length < 2){ toast('Adicione pelo menos 2 equipes', 'error'); return; }
    const teams = [...t.teams];
    // se quantidade não é potência de 2, adiciona byes (null) até próxima potência
    const nextPow = 1 << Math.ceil(Math.log2(teams.length));
    const byes = nextPow - teams.length;
    for(let i=0;i<byes;i++){ teams.push({ id: null, name: 'BYE', color: '#ddd' }); }

    // shuffle leve
    teams.sort(() => Math.random() - 0.5);

    // Round 1
    const round1 = [];
    for(let i=0;i<teams.length;i+=2){
      const a = teams[i];
      const b = teams[i+1];
      round1.push({ id: uid(), roundIndex: 0, teamAId: a?.id ?? null, teamBId: b?.id ?? null, scoreA: null, scoreB: null, status: 'scheduled' });
    }

    t.matches = [round1];
    // Gera rounds seguintes vazios
    let size = round1.length;
    while(size > 1){
      size = Math.ceil(size / 2);
      t.matches.push(new Array(size).fill(0).map((_,i) => ({ id: uid(), roundIndex: t.matches.length, teamAId: null, teamBId: null, scoreA: null, scoreB: null, status: 'scheduled' })));
    }
    propagateWinners(t);
    save();
    openTournament(t.id);
    // desativado toast aqui para não conflitar com header
    // toast('Chaveamento gerado', 'success');
    hideStrayTopBadge();
    startBadgeMonitor(4000);
  }

  function propagateWinners(t){
    for(let r=0;r<t.matches.length-1;r++){
      const round = t.matches[r];
      for(let i=0;i<round.length;i+=2){
        const mA = round[i];
        const mB = round[i+1];
        const nextIndex = Math.floor(i/2);
        const next = t.matches[r+1][nextIndex];
        next.teamAId = winnerOf(mA, t);
        next.teamBId = winnerOf(mB, t);
      }
    }
  }

  function winnerOf(m, t){
    if(m.teamAId == null) return m.teamBId;
    if(m.teamBId == null) return m.teamAId;
    if(m.scoreA == null || m.scoreB == null) return null;
    if(m.scoreA > m.scoreB) return m.teamAId;
    if(m.scoreB > m.scoreA) return m.teamBId;
    return null; // empate não define
  }

  // Utils
  function escapeHtml(str){
    return String(str).replace(/[&<>"]+/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
  }
  function formatDate(ts){
    const d = new Date(ts);
    return d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short' });
  }

  // Events
  els.newBtn && els.newBtn.addEventListener('click', createTournament);
  els.emptyNewBtn && els.emptyNewBtn.addEventListener('click', createTournament);
  els.addTeamBtn && els.addTeamBtn.addEventListener('click', () => {
    const t = tournaments.find(x => x.id === currentId);
    if(!t) return;
    const name = prompt('Nome da equipe:');
    if(!name) return;
    t.teams.push({ id: uid(), name, color: '#6bca3f' });
    save(); openTournament(t.id);
  });
  els.genBracketBtn && els.genBracketBtn.addEventListener('click', generateBracket);

  els.name && els.name.addEventListener('input', (e) => {
    const t = tournaments.find(x => x.id === currentId);
    if(!t) return;
    t.name = e.target.value || 'Sem nome';
    save();
  });
  els.type && els.type.addEventListener('change', (e) => {
    const t = tournaments.find(x => x.id === currentId);
    if(!t) return;
    t.type = e.target.value;
    save();
  });

  els.exportBtn && els.exportBtn.addEventListener('click', () => {
    const data = JSON.stringify(tournaments, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'torneios-passa-a-bola.json'; a.click();
    URL.revokeObjectURL(url);
    toast('Arquivo exportado', 'success');
  });

  els.importBtn && els.importBtn.addEventListener('click', () => {
    els.importInput.click();
  });
  els.importInput && els.importInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    try{
      const text = await file.text();
      const data = JSON.parse(text);
      if(Array.isArray(data)){
        tournaments = data;
        store.write(tournaments);
        renderList();
        showEmpty();
        updateStats();
        toast('Importação concluída', 'success');
      } else {
        toast('Arquivo inválido', 'error');
      }
    }catch(err){
      toast('Falha ao importar', 'error');
    } finally {
      e.target.value = '';
    }
  });

  els.clearAllBtn && els.clearAllBtn.addEventListener('click', () => {
    if(confirm('Excluir todos os torneios?')){
      tournaments = [];
      store.write(tournaments);
      currentId = null;
      renderList();
      showEmpty();
      updateStats();
      toast('Tudo limpo', 'success');
    }
  });

  // Init
  renderList();
  if(tournaments.length > 0){ openTournament(tournaments[0].id); } else { showEmpty(); }
  // tentativa de remover qualquer badge flutuante indevido no topo (alguns navegadores)
  setTimeout(hideStrayTopBadge, 50);
  startBadgeMonitor(3000);

  function hideStrayTopBadge(){
    const nodes = Array.from(document.body.querySelectorAll('*')).slice(0, 8000);
    nodes.forEach(el => {
      if(el.closest('.header') || el.id === 'sidebarMenu') return;
      const cs = window.getComputedStyle(el);
      if(cs.position === 'fixed'){
        const top = parseInt(cs.top || '0', 10) || 0;
        const right = parseInt(cs.right || '0', 10) || 0;
        const z = parseInt(cs.zIndex || '0', 10) || 0;
        const rect = el.getBoundingClientRect();
        const text = (el.textContent || '').trim().toLowerCase();
        const looksLikeBadge = top >= 0 && top < 160 && (right >= 0 && right < 260) && rect.width <= 520 && z >= 0 && (text.includes('tbd') || text.includes(' x '));
        if(looksLikeBadge){ el.classList.add('force-hidden'); }
      }
    });
  }

  function startBadgeMonitor(durationMs){
    const obs = new MutationObserver(() => hideStrayTopBadge());
    obs.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => obs.disconnect(), durationMs);
  }

  // UI helpers
  function toast(message, type='success'){
    if(!ENABLE_TOASTS) return;
    if(!els.toaster) return;
    const div = document.createElement('div');
    div.className = `toast ${type}`;
    div.textContent = message;
    els.toaster.appendChild(div);
    // garantir posição no rodapé, nunca no topo
    els.toaster.style.bottom = '20px';
    els.toaster.style.top = '';
    els.toaster.style.left = '20px';
    els.toaster.style.right = '';
    setTimeout(() => {
      div.style.opacity = '0';
      div.style.transform = 'translateY(8px)';
      setTimeout(() => div.remove(), 250);
    }, 2200);
  }

  function updateStats(){
    if(!els.statT) return;
    const t = tournaments.find(x => x.id === currentId);
    const totalMatches = t ? t.matches.flat().length : 0;
    const totalTeams = t ? t.teams.length : 0;
    els.statT.textContent = String(tournaments.length);
    els.statTeams.textContent = String(totalTeams);
    els.statMatches.textContent = String(totalMatches);
  }
})();


