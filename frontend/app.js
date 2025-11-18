const API = 'http://localhost:5000/api';
const state = {
  page: 'home',
  user: null,
  token: localStorage.getItem('token'),
  tab: 'overview',
  modal: null,
  filters: { partidas: 'todos', quadras: 'todos', jogadores: 'todos' },
  data: { partidas: [], quadras: [], jogadores: [], campeonatos: [], stats: null }
};

// IMAGENS PARA ESPORTES
const SPORT_IMAGES = {
  futebol: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
  futsal: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
  volei: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80',
  basquete: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80'
};

async function init() {
  if (state.token) {
    try {
      const res = await fetch(API + '/users/me', { headers: { Authorization: 'Bearer ' + state.token } });
      if (res.ok) state.user = await res.json();
      else { localStorage.removeItem('token'); state.token = null; }
    } catch { localStorage.removeItem('token'); state.token = null; }
  }
  
  try {
    const [p, q, j, c, s] = await Promise.all([
      fetch(API + '/partidas').then(r => r.json()).catch(() => []),
      fetch(API + '/quadras').then(r => r.json()).catch(() => []),
      fetch(API + '/users').then(r => r.json()).catch(() => []),
      fetch(API + '/campeonatos').then(r => r.json()).catch(() => []),
      fetch(API + '/stats/dashboard').then(r => r.json()).catch(() => null)
    ]);
    state.data = { partidas: p, quadras: q, jogadores: j, campeonatos: c, stats: s };
  } catch (err) {
    console.error('Erro:', err);
  }
  
  render();
}

function navigate(page) {
  state.page = page;
  state.tab = 'overview';
  state.modal = null;
  window.scrollTo(0, 0);
  render();
}

function logout() {
  localStorage.removeItem('token');
  state.user = null;
  state.token = null;
  navigate('home');
}

function openModal(id) {
  state.modal = id;
  render();
  setTimeout(() => {
    const modal = document.getElementById('modal-' + id);
    if (modal) modal.classList.add('active');
  }, 10);
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
  state.modal = null;
}

function switchTab(tab) {
  state.tab = tab;
  render();
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Entrando...';
  btn.disabled = true;
  
  try {
    const res = await fetch(API + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      state.token = data.token;
      state.user = data.user;
      navigate('home');
    } else {
      alert('Login falhou');
      btn.textContent = 'Entrar';
      btn.disabled = false;
    }
  } catch {
    alert('Erro ao fazer login');
    btn.textContent = 'Entrar';
    btn.disabled = false;
  }
}

function inscreverPartida(id) {
  if (!state.user) {
    alert('Faça login para se inscrever!');
    navigate('login');
    return;
  }
  alert('Inscrição confirmada na partida #' + id + '!\n\nRedirecionando para pagamento...');
  closeModal();
}

function reservarQuadra(id, horario) {
  if (!state.user) {
    alert('Faça login para reservar!');
    navigate('login');
    return;
  }
  alert('Reserva confirmada!\nQuadra #' + id + '\nHorário: ' + horario + '\n\nRedirecionando para pagamento...');
  closeModal();
}

function convocarJogador(id) {
  if (!state.user) {
    alert('Faça login para convocar jogadores!');
    navigate('login');
    return;
  }
  alert('Convite enviado ao jogador #' + id + '!');
}

function inscreverCampeonato(id) {
  if (!state.user) {
    alert('Faça login para se inscrever!');
    navigate('login');
    return;
  }
  alert('Inscrição iniciada no campeonato #' + id + '!\n\nPreencha os dados do seu time.');
  closeModal();
}

function Navbar() {
  return `
    <nav class="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <a href="#" onclick="navigate('home'); return false;" class="flex items-center space-x-2 group">
            <div class="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-110 transition">P</div>
            <div class="flex flex-col -space-y-1">
              <span class="text-xl font-bold text-gray-900">Pelada Fácil</span>
              <span class="text-xs text-primary font-medium">Esporte Amador</span>
            </div>
          </a>
          
          <div class="hidden md:flex items-center space-x-8">
            <a href="#" onclick="navigate('partidas'); return false;" class="text-sm font-medium ${state.page === 'partidas' ? 'text-primary' : 'text-gray-700 hover:text-primary'} transition">Partidas</a>
            <a href="#" onclick="navigate('quadras'); return false;" class="text-sm font-medium ${state.page === 'quadras' ? 'text-primary' : 'text-gray-700 hover:text-primary'} transition">Quadras</a>
            <a href="#" onclick="navigate('campeonatos'); return false;" class="text-sm font-medium ${state.page === 'campeonatos' ? 'text-primary' : 'text-gray-700 hover:text-primary'} transition">Campeonatos</a>
            <a href="#" onclick="navigate('jogadores'); return false;" class="text-sm font-medium ${state.page === 'jogadores' ? 'text-primary' : 'text-gray-700 hover:text-primary'} transition">Jogadores</a>
            
            ${state.user ? `
              <div class="flex items-center space-x-3">
                <div class="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-full">
                  <img src="${state.user.foto}" class="w-7 h-7 rounded-full border-2 border-white shadow-sm" />
                  <span class="text-sm font-medium text-gray-700">${state.user.nome.split(' ')[0]}</span>
                </div>
                ${state.user.is_admin ? '<a href="#" onclick="navigate(\'admin\'); return false;" class="px-4 py-2 bg-accent text-white rounded-lg text-xs font-bold hover:bg-accent-dark transition shadow-sm">ADMIN</a>' : ''}
                <button onclick="logout()" class="text-sm font-medium text-red-600 hover:text-red-700 transition">Sair</button>
              </div>
            ` : '<a href="#" onclick="navigate(\'login\'); return false;" class="bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition shadow-sm">Entrar</a>'}
          </div>
        </div>
      </div>
    </nav>
  `;
}

function HomePage() {
  return Navbar() + `
    <div class="gradient-hero text-white py-24 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>
      <div class="max-w-7xl mx-auto px-4 relative">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-6xl font-extrabold mb-6 leading-tight">A Revolução do<br/>Esporte Amador</h1>
          <p class="text-2xl mb-4 text-green-50 font-medium">Organize partidas, reserve quadras e participe de campeonatos</p>
          <p class="text-lg mb-10 text-green-100 max-w-2xl mx-auto">A plataforma completa para atletas amadores. Nunca mais cancele um jogo por falta de gente!</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button onclick="navigate('partidas')" class="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition shadow-xl hover:shadow-2xl hover:scale-105">
              🎯 Ver Partidas Abertas
            </button>
            <button onclick="navigate('quadras')" class="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary transition shadow-xl">
              🏟️ Reservar Quadra
            </button>
          </div>
        </div>
        
        ${state.data.stats ? `
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            <div class="stat-card rounded-xl p-6 text-center border border-white/20 hover:bg-white/10 transition">
              <div class="text-4xl font-bold mb-1">${state.data.stats.totalUsuarios}+</div>
              <div class="text-sm text-green-100">Jogadores Ativos</div>
            </div>
            <div class="stat-card rounded-xl p-6 text-center border border-white/20 hover:bg-white/10 transition">
              <div class="text-4xl font-bold mb-1">${state.data.stats.partidasAbertas}</div>
              <div class="text-sm text-green-100">Partidas Abertas</div>
            </div>
            <div class="stat-card rounded-xl p-6 text-center border border-white/20 hover:bg-white/10 transition">
              <div class="text-4xl font-bold mb-1">${state.data.stats.totalQuadras}+</div>
              <div class="text-sm text-green-100">Quadras</div>
            </div>
            <div class="stat-card rounded-xl p-6 text-center border border-white/20 hover:bg-white/10 transition">
              <div class="text-4xl font-bold mb-1">${state.data.stats.totalCampeonatos}</div>
              <div class="text-sm text-green-100">Campeonatos</div>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
    
    <!-- Features -->
    <div class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4">Por que escolher o Pelada Fácil?</h2>
          <p class="text-xl text-gray-600">A plataforma mais completa para o esporte amador</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="card-hover bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div class="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6 text-2xl">👥</div>
            <h3 class="text-2xl font-bold mb-3">Mercado de Jogadores</h3>
            <p class="text-gray-600 leading-relaxed">Encontre jogadores disponíveis na sua região em segundos. Nunca mais cancele um jogo por falta de gente.</p>
          </div>
          <div class="card-hover bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div class="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6 text-2xl">🏟️</div>
            <h3 class="text-2xl font-bold mb-3">Reserve Quadras</h3>
            <p class="text-gray-600 leading-relaxed">Encontre e reserve as melhores quadras próximas a você. Sistema online rápido e seguro.</p>
          </div>
          <div class="card-hover bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div class="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 text-2xl">🏆</div>
            <h3 class="text-2xl font-bold mb-3">Gamificação</h3>
            <p class="text-gray-600 leading-relaxed">Acompanhe estatísticas, conquiste troféus e suba no ranking. Evolua como num videogame!</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Partidas -->
    <div class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center mb-10">
          <div>
            <h2 class="text-3xl font-bold mb-2">Próximas Partidas</h2>
            <p class="text-gray-600">Encontre a partida perfeita para você</p>
          </div>
          <a href="#" onclick="navigate('partidas'); return false;" class="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            Ver todas 
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </a>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          ${state.data.partidas.slice(0, 3).map(p => `
            <div class="card-hover bg-white rounded-xl overflow-hidden border cursor-pointer" onclick="openModal(${p.id})">
              <div class="h-48 relative overflow-hidden">
                <img src="${SPORT_IMAGES[p.esporte] || SPORT_IMAGES.futebol}" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute top-4 left-4">
                  <span class="bg-white/95 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase backdrop-blur-sm">${p.esporte}</span>
                </div>
                <div class="absolute top-4 right-4">
                  <span class="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">${p.vagas_disponiveis} vagas</span>
                </div>
                <div class="absolute bottom-4 left-4 right-4">
                  <h3 class="text-white font-bold text-lg">${p.titulo}</h3>
                </div>
              </div>
              <div class="p-5">
                <div class="space-y-2 mb-4">
                  <div class="flex items-center text-sm text-gray-600">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    ${new Date(p.data_hora).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div class="flex items-center text-sm text-gray-600">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                    ${p.local}
                  </div>
                </div>
                <div class="flex justify-between items-center pt-4 border-t">
                  <span class="text-2xl font-bold text-primary">R$ ${p.valor_individual}</span>
                  <span class="text-sm font-semibold text-gray-600">${p.vagas_disponiveis}/${p.vagas_totais}</span>
                </div>
              </div>
            </div>
            
            ${ModalPartida(p)}
          `).join('')}
        </div>
      </div>
    </div>
    
    <div class="bg-gradient-to-r from-primary via-primary-light to-primary-dark text-white py-20">
      <div class="max-w-4xl mx-auto text-center px-4">
        <h2 class="text-5xl font-bold mb-6">Pronto para jogar?</h2>
        <p class="text-2xl mb-10 text-green-50">Junte-se a milhares de atletas e leve seu jogo ao próximo nível</p>
        <button onclick="navigate('${state.user ? 'partidas' : 'login'}')" class="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition shadow-2xl hover:scale-105">
          Começar Agora - É Grátis! 🚀
        </button>
      </div>
    </div>
  `;
}

function ModalPartida(p) {
  return `
    <div id="modal-${p.id}" class="modal" onclick="if(event.target === this) closeModal()">
      <div class="bg-white rounded-2xl max-w-2xl w-full mx-4 overflow-hidden shadow-2xl" onclick="event.stopPropagation()">
        <div class="h-72 relative">
          <img src="${SPORT_IMAGES[p.esporte] || SPORT_IMAGES.futebol}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <button onclick="closeModal()" class="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <div class="absolute bottom-6 left-6 right-6">
            <span class="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 inline-block">${p.esporte}</span>
            <h2 class="text-3xl font-bold text-white">${p.titulo}</h2>
          </div>
        </div>
        <div class="p-6">
          <div class="grid md:grid-cols-2 gap-4 mb-6">
            <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">📅</div>
              <div>
                <div class="text-xs text-gray-500">Data e Hora</div>
                <div class="font-semibold">${new Date(p.data_hora).toLocaleString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
            <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">📍</div>
              <div>
                <div class="text-xs text-gray-500">Local</div>
                <div class="font-semibold">${p.local}</div>
              </div>
            </div>
            <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">👥</div>
              <div>
                <div class="text-xs text-gray-500">Vagas</div>
                <div class="font-semibold">${p.vagas_disponiveis} de ${p.vagas_totais} disponíveis</div>
              </div>
            </div>
            <div class="flex items-center space-x-3 p-4 bg-primary/10 rounded-lg">
              <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">💰</div>
              <div>
                <div class="text-xs text-primary font-semibold">Valor por pessoa</div>
                <div class="font-bold text-2xl text-primary">R$ ${p.valor_individual}</div>
              </div>
            </div>
          </div>
          <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div class="flex items-start space-x-3">
              <img src="${p.organizador_foto}" class="w-12 h-12 rounded-full border-2 border-white shadow" />
              <div class="flex-1">
                <div class="font-semibold">${p.organizador_nome}</div>
                <div class="text-sm text-gray-600">Organizador</div>
                <div class="text-sm text-yellow-600">⭐ 4.8 · 127 partidas</div>
              </div>
            </div>
          </div>
          <button onclick="inscreverPartida(${p.id})" class="w-full bg-primary text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition shadow-lg hover:shadow-xl">
            Participar desta Partida 🎯
          </button>
        </div>
      </div>
    </div>
  `;
}

// Continuo no próximo bloco...

function LoginPage() {
  return `
    <div class="min-h-screen flex">
      <div class="hidden lg:block lg:w-1/2 gradient-hero relative">
        <div class="absolute inset-0 bg-black/20"></div>
        <img src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200&q=80" class="w-full h-full object-cover mix-blend-overlay opacity-60" />
        <div class="absolute inset-0 flex items-center justify-center text-white p-12">
          <div class="max-w-md text-center">
            <h2 class="text-5xl font-bold mb-6">Bem-vindo de volta!</h2>
            <p class="text-2xl text-green-50">Acesse sua conta e organize sua próxima partida</p>
          </div>
        </div>
      </div>
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div class="max-w-md w-full">
          <div class="mb-6">
            <a href="#" onclick="navigate('home'); return false;" class="inline-flex items-center text-gray-600 hover:text-primary transition">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Voltar ao início
            </a>
          </div>
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">P</div>
            <h1 class="text-3xl font-bold mb-2">Entrar na sua conta</h1>
            <p class="text-gray-600">Organize partidas e encontre jogadores</p>
          </div>
          <form onsubmit="handleLogin(event)" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" id="email" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition" placeholder="seu@email.com" required />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
              <input type="password" id="senha" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition" placeholder="••••••••" required />
            </div>
            <button type="submit" class="w-full bg-primary text-white px-4 py-3 rounded-lg font-bold hover:bg-primary-dark transition shadow-md hover:shadow-lg">Entrar</button>
          </form>
          <div class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p class="text-sm font-semibold text-blue-900 mb-2">🎯 Conta de teste:</p>
            <p class="text-xs text-blue-700 font-mono">admin@peladafacil.com</p>
            <p class="text-xs text-blue-700 font-mono">admin123</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function PartidasPage() {
  const filtradas = state.filters.partidas === 'todos' 
    ? state.data.partidas 
    : state.data.partidas.filter(p => p.esporte === state.filters.partidas);
    
  return Navbar() + `
    <div class="bg-gradient-to-r from-primary to-primary-light text-white py-12">
      <div class="max-w-7xl mx-auto px-4">
        <h1 class="text-4xl font-bold mb-2">Partidas Abertas</h1>
        <p class="text-green-50 text-lg">Encontre a partida perfeita para você jogar</p>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="bg-white rounded-xl p-4 mb-6 border flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium">Filtrar:</label>
            <select onchange="state.filters.partidas = this.value; render();" class="px-3 py-2 border rounded-lg text-sm">
              <option value="todos">Todos os esportes</option>
              <option value="futebol">⚽ Futebol</option>
              <option value="futsal">🏐 Futsal</option>
              <option value="volei">🏐 Vôlei</option>
              <option value="basquete">🏀 Basquete</option>
            </select>
          </div>
        </div>
        <button class="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition shadow-sm">
          ➕ Criar Partida
        </button>
      </div>
      
      <div class="grid md:grid-cols-3 gap-6">
        ${filtradas.map(p => `
          <div class="card-hover bg-white rounded-xl overflow-hidden border cursor-pointer" onclick="openModal(${p.id})">
            <div class="h-52 relative">
              <img src="${SPORT_IMAGES[p.esporte] || SPORT_IMAGES.futebol}" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div class="absolute top-3 left-3">
                <span class="bg-white/95 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">${p.esporte}</span>
              </div>
              <div class="absolute top-3 right-3">
                <span class="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">${p.vagas_disponiveis}/${p.vagas_totais}</span>
              </div>
              <div class="absolute bottom-3 left-3 right-3">
                <h3 class="text-white font-bold text-lg">${p.titulo}</h3>
              </div>
            </div>
            <div class="p-5">
              <div class="space-y-2 text-sm mb-4">
                <div class="flex items-center text-gray-600">
                  📅 ${new Date(p.data_hora).toLocaleString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
                <div class="flex items-center text-gray-600">
                  📍 ${p.local}
                </div>
              </div>
              <div class="flex justify-between items-center pt-4 border-t">
                <span class="text-2xl font-bold text-primary">R$ ${p.valor_individual}</span>
                <button class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark">Ver Detalhes</button>
              </div>
            </div>
          </div>
          ${ModalPartida(p)}
        `).join('')}
      </div>
    </div>
  `;
}

// ADMIN PAGE COM TABS FUNCIONAIS
function AdminPage() {
  if (!state.user || !state.user.is_admin) {
    return Navbar() + '<div class="p-20 text-center"><h1 class="text-3xl font-bold text-red-600">❌ Acesso negado</h1><p class="text-gray-600 mt-4">Você precisa ser administrador para acessar esta página.</p></div>';
  }
  
  return Navbar() + `
    <div class="bg-gradient-to-r from-accent to-accent-dark text-white py-8 border-b-4 border-accent-dark">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">🛡️ Painel Administrativo</h1>
            <p class="text-orange-100">Gerencie toda a plataforma Pelada Fácil</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <div class="text-xs text-orange-100">Notificações</div>
              <div class="text-2xl font-bold">${state.data.stats?.pagamentosPendentes || 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tabs -->
    <div class="bg-white border-b sticky top-16 z-40">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex space-x-8 overflow-x-auto">
          ${['overview', 'pagamentos', 'quadras', 'usuarios'].map(tab => `
            <button onclick="switchTab('${tab}')" class="py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${state.tab === tab ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700'}">
              ${tab === 'overview' ? '📊 Visão Geral' : tab === 'pagamentos' ? '💰 Pagamentos' : tab === 'quadras' ? '🏟️ Quadras' : '👥 Usuários'}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- OVERVIEW -->
      <div class="tab-content ${state.tab === 'overview' ? 'active' : ''}">
        <div class="grid md:grid-cols-4 gap-6 mb-8">
          <div class="card-hover bg-white rounded-xl p-6 border">
            <div class="flex items-center justify-between mb-4">
              <div class="text-4xl">👥</div>
              <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">+12%</span>
            </div>
            <div class="text-3xl font-bold text-gray-900">${state.data.stats?.totalUsuarios || 0}</div>
            <div class="text-sm text-gray-600">Total de Usuários</div>
          </div>
          <div class="card-hover bg-white rounded-xl p-6 border">
            <div class="flex items-center justify-between mb-4">
              <div class="text-4xl">💰</div>
              <span class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-semibold">R$ 12.5k</span>
            </div>
            <div class="text-3xl font-bold text-gray-900">${state.data.stats?.partidasAbertas || 0}</div>
            <div class="text-sm text-gray-600">Partidas Ativas</div>
          </div>
          <div class="card-hover bg-white rounded-xl p-6 border">
            <div class="flex items-center justify-between mb-4">
              <div class="text-4xl">🏟️</div>
              <span class="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full font-semibold">+5</span>
            </div>
            <div class="text-3xl font-bold text-gray-900">${state.data.stats?.totalQuadras || 0}</div>
            <div class="text-sm text-gray-600">Quadras Cadastradas</div>
          </div>
          <div class="card-hover bg-white rounded-xl p-6 border">
            <div class="flex items-center justify-between mb-4">
              <div class="text-4xl">⏰</div>
              <span class="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-semibold">Urgente</span>
            </div>
            <div class="text-3xl font-bold text-gray-900">${state.data.stats?.pagamentosPendentes || 0}</div>
            <div class="text-sm text-gray-600">Pendências</div>
          </div>
        </div>
      </div>
      
      <!-- PAGAMENTOS -->
      <div class="tab-content ${state.tab === 'pagamentos' ? 'active' : ''}">
        <div class="bg-white rounded-xl p-6 border">
          <h2 class="text-2xl font-bold mb-6">💰 Gerenciamento de Pagamentos</h2>
          <p class="text-gray-600">Sistema de pagamentos será implementado em breve...</p>
        </div>
      </div>
      
      <!-- QUADRAS -->
      <div class="tab-content ${state.tab === 'quadras' ? 'active' : ''}">
        <div class="bg-white rounded-xl p-6 border">
          <h2 class="text-2xl font-bold mb-6">🏟️ Aprovação de Quadras</h2>
          <p class="text-gray-600">Sistema de aprovação será implementado em breve...</p>
        </div>
      </div>
      
      <!-- USUÁRIOS -->
      <div class="tab-content ${state.tab === 'usuarios' ? 'active' : ''}">
        <div class="bg-white rounded-xl p-6 border">
          <h2 class="text-2xl font-bold mb-6">👥 Gestão de Usuários</h2>
          <div class="grid md:grid-cols-3 gap-4">
            ${state.data.jogadores.slice(0, 9).map(j => `
              <div class="p-4 border rounded-lg hover:shadow-md transition">
                <div class="flex items-center space-x-3 mb-3">
                  <img src="${j.foto}" class="w-12 h-12 rounded-full border-2 border-gray-100" />
                  <div>
                    <div class="font-semibold">${j.nome}</div>
                    <div class="text-xs text-gray-500">${j.email}</div>
                  </div>
                </div>
                <div class="text-sm space-y-1">
                  <div class="flex justify-between"><span class="text-gray-600">Partidas:</span><span class="font-medium">${j.total_partidas}</span></div>
                  <div class="flex justify-between"><span class="text-gray-600">Reputação:</span><span class="font-medium">${j.reputacao} ⭐</span></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function render() {
  const pages = {
    home: HomePage,
    login: LoginPage,
    partidas: PartidasPage,
    admin: AdminPage
  };
  
  const Page = pages[state.page] || HomePage;
  document.getElementById('app').innerHTML = Page();
}

window.navigate = navigate;
window.logout = logout;
window.handleLogin = handleLogin;
window.openModal = openModal;
window.closeModal = closeModal;
window.switchTab = switchTab;
window.inscreverPartida = inscreverPartida;

init();
