const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const db = new Database('database.db');

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'pelada-facil-secret-2025';

// CRIAR TABELAS
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    telefone TEXT,
    foto TEXT DEFAULT 'https://i.pravatar.cc/150',
    tipo_usuario TEXT DEFAULT 'jogador',
    is_admin INTEGER DEFAULT 0,
    reputacao REAL DEFAULT 3.0,
    total_partidas INTEGER DEFAULT 0,
    total_gols INTEGER DEFAULT 0,
    total_assistencias INTEGER DEFAULT 0,
    total_avaliacoes INTEGER DEFAULT 0,
    nivel_habilidade INTEGER DEFAULT 1,
    posicao TEXT,
    cidade TEXT DEFAULT 'São Paulo',
    disponivel INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS partidas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    esporte TEXT NOT NULL,
    data_hora DATETIME NOT NULL,
    local TEXT NOT NULL,
    endereco TEXT,
    valor_individual REAL NOT NULL,
    vagas_totais INTEGER NOT NULL,
    vagas_disponiveis INTEGER NOT NULL,
    nivel_minimo INTEGER DEFAULT 1,
    foto TEXT,
    status TEXT DEFAULT 'aberta',
    organizador_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizador_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS quadras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    endereco TEXT NOT NULL,
    cidade TEXT NOT NULL,
    esportes TEXT NOT NULL,
    valor_hora REAL NOT NULL,
    foto TEXT,
    dono_id INTEGER,
    telefone TEXT,
    status TEXT DEFAULT 'pendente',
    avaliacoes REAL DEFAULT 4.5,
    total_avaliacoes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dono_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS campeonatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    esporte TEXT NOT NULL,
    status TEXT DEFAULT 'inscricoes_abertas',
    valor_inscricao REAL NOT NULL,
    data_inicio DATE,
    data_fim DATE,
    numero_times INTEGER,
    times_inscritos INTEGER DEFAULT 0,
    foto TEXT,
    premios TEXT,
    regulamento TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS inscricoes_campeonato (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campeonato_id INTEGER,
    usuario_id INTEGER,
    nome_time TEXT NOT NULL,
    status TEXT DEFAULT 'confirmada',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campeonato_id) REFERENCES campeonatos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    referencia_id INTEGER,
    referencia_tipo TEXT NOT NULL,
    nome TEXT NOT NULL,
    valor REAL NOT NULL,
    status TEXT DEFAULT 'pendente',
    metodo TEXT,
    usuario_id INTEGER,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  );
`);

console.log('✅ Tabelas criadas!');

// POPULAR COM DADOS
const adminExists = db.prepare('SELECT id FROM usuarios WHERE email = ?').get('admin@peladafacil.com');

if (!adminExists) {
  console.log('📝 Populando banco de dados...');
  
  const hashedAdmin = bcrypt.hashSync('admin123', 10);
  const hashedJogador = bcrypt.hashSync('jogador123', 10);
  
  db.prepare(`INSERT INTO usuarios (nome, email, senha, is_admin, foto, tipo_usuario, cidade) VALUES (?, ?, ?, 1, ?, 'admin', 'São Paulo')`)
    .run('Administrador', 'admin@peladafacil.com', hashedAdmin, 'https://i.pravatar.cc/150?img=50');
  
  db.prepare(`INSERT INTO usuarios (nome, email, senha, telefone, foto, tipo_usuario, posicao, reputacao, total_partidas, total_gols, total_assistencias, total_avaliacoes, nivel_habilidade, cidade, disponivel) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run('Carlos Silva', 'jogador@email.com', hashedJogador, '(11) 98765-4321', 'https://i.pravatar.cc/150?img=12', 'jogador', 'Atacante', 4.8, 45, 28, 12, 89, 5, 'São Paulo', 1);
  
  const nomes = ['Roberto', 'Fernando', 'Marcelo', 'Diego', 'Rafael', 'Lucas', 'Pedro', 'João', 'Thiago', 'Bruno'];
  const sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Costa', 'Ferreira', 'Alves', 'Pereira', 'Rodrigues'];
  const posicoes = ['Atacante', 'Meia', 'Zagueiro', 'Goleiro', 'Lateral', 'Volante'];
  const cidades = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Brasília'];
  
  for (let i = 1; i <= 50; i++) {
    const senha = bcrypt.hashSync('senha123', 10);
    const nome = nomes[i % nomes.length] + ' ' + sobrenomes[i % sobrenomes.length];
    const tipos = i % 5 === 0 ? 'dono_quadra' : 'jogador';
    
    db.prepare(`INSERT INTO usuarios (nome, email, senha, telefone, foto, tipo_usuario, posicao, reputacao, total_partidas, total_gols, total_assistencias, total_avaliacoes, nivel_habilidade, cidade, disponivel) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(
        nome,
        'user' + i + '@email.com',
        senha,
        '(11) 9' + Math.floor(Math.random() * 90000000 + 10000000),
        'https://i.pravatar.cc/150?img=' + i,
        tipos,
        posicoes[i % posicoes.length],
        3 + Math.random() * 2,
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 50),
        Math.floor(Math.random() * 30),
        Math.floor(Math.random() * 150),
        1 + Math.floor(Math.random() * 5),
        cidades[i % cidades.length],
        1
      );
  }
  
  const partidas = [
    ['Pelada Sábado Manhã', 'Racha animado no fim de semana!', 'futebol', '2025-11-23 09:00:00', 'Arena São Paulo', 'Rua das Flores, 123', 25, 20, 15, 2, 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800'],
    ['Futsal Noturno', 'Futsal competitivo', 'futsal', '2025-11-24 19:00:00', 'Quadra Central', 'Av. Paulista, 456', 20, 14, 8, 1, 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800'],
    ['Racha Domingo', 'Pelada tradicional de domingo', 'futebol', '2025-11-24 15:00:00', 'Campo Morumbi', 'Rua Morumbi, 789', 30, 22, 5, 3, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'],
    ['Vôlei de Areia', 'Vôlei na praia', 'volei', '2025-11-25 10:00:00', 'Beach Sports', 'Orla da Praia', 15, 8, 4, 1, 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800'],
    ['Basquete 3x3', 'Basquete de rua', 'basquete', '2025-11-26 17:00:00', 'Quadra Poliesportiva', 'Rua dos Esportes, 321', 18, 6, 2, 2, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'],
    ['Futebol Society', 'Society quinta-feira', 'futebol', '2025-11-28 20:00:00', 'Arena Sports Center', 'Av. Brasil, 999', 35, 14, 10, 2, 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800'],
    ['Vôlei Indoor', 'Vôlei quadra coberta', 'volei', '2025-11-29 18:00:00', 'Centro Esportivo', 'Rua Central, 555', 25, 12, 7, 2, 'https://images.unsplash.com/photo-1593786481097-4b47c9e39c6e?w=800']
  ];
  
  partidas.forEach(p => {
    db.prepare(`INSERT INTO partidas (titulo, descricao, esporte, data_hora, local, endereco, valor_individual, vagas_totais, vagas_disponiveis, nivel_minimo, foto, organizador_id, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'aberta')`)
      .run(...p);
  });
  
  const quadras = [
    ['Arena São Paulo Premium', 'Rua das Flores, 123', 'São Paulo', 'futebol,futsal', 150, 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800', '(11) 98888-1111', 4.8, 127, 'aprovada'],
    ['Quadra Central Paulista', 'Av. Paulista, 456', 'São Paulo', 'futsal,volei,basquete', 120, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', '(11) 98888-2222', 4.6, 89, 'aprovada'],
    ['Campo Society Norte', 'Rua Norte, 789', 'São Paulo', 'futebol', 100, 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800', '(11) 98888-3333', 4.9, 203, 'aprovada'],
    ['Quadra Vila Mariana', 'Rua da Vila, 234', 'São Paulo', 'futsal,volei', 90, 'https://images.unsplash.com/photo-1592656094267-764a45160876?w=800', '(11) 98888-4444', 4.3, 56, 'aprovada'],
    ['Arena Pinheiros', 'Av. Pinheiros, 567', 'São Paulo', 'futebol,futsal,basquete', 180, 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800', '(11) 98888-5555', 4.7, 134, 'aprovada'],
    ['Esporte Clube Zona Sul', 'Rua Sul, 888', 'São Paulo', 'futebol,volei', 110, 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800', '(11) 98888-6666', 4.4, 78, 'pendente'],
    ['Quadra Poliesportiva Leste', 'Av. Leste, 444', 'São Paulo', 'basquete,volei,futsal', 95, 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800', '(11) 98888-7777', 4.2, 45, 'pendente']
  ];
  
  quadras.forEach(q => {
    db.prepare(`INSERT INTO quadras (nome, endereco, cidade, esportes, valor_hora, foto, telefone, avaliacoes, total_avaliacoes, dono_id, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 2, ?)`)
      .run(...q);
  });
  
  const campeonatos = [
    ['Copa Pelada Fácil 2025', 'O maior campeonato amador de São Paulo', 'futebol', 'inscricoes_abertas', 200, '2025-12-01', '2026-01-30', 16, 8, 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800', 'R$ 5.000 (1º), R$ 2.000 (2º), R$ 1.000 (3º)', 'Campeonato eliminatório com fase de grupos'],
    ['Torneio de Futsal Indoor', 'Futsal profissional amador', 'futsal', 'inscricoes_abertas', 150, '2025-12-15', '2026-02-15', 12, 5, 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800', 'R$ 3.000 (1º), R$ 1.000 (2º)', 'Sistema de pontos corridos + playoffs'],
    ['Liga de Basquete Amador', 'Liga mensal de basquete 3x3', 'basquete', 'em_andamento', 180, '2025-11-01', '2025-12-30', 8, 8, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', 'R$ 4.000 (1º), R$ 1.500 (2º)', 'Playoffs ao final da temporada'],
    ['Campeonato de Vôlei de Praia', 'Vôlei na areia', 'volei', 'inscricoes_abertas', 120, '2025-12-10', '2026-01-20', 10, 4, 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800', 'R$ 2.500 (1º), R$ 1.000 (2º)', 'Duplas, eliminatória simples']
  ];
  
  campeonatos.forEach(c => {
    db.prepare(`INSERT INTO campeonatos (nome, descricao, esporte, status, valor_inscricao, data_inicio, data_fim, numero_times, times_inscritos, foto, premios, regulamento) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(...c);
  });
  
  console.log('✅ Banco de dados populado com sucesso!');
  console.log('📊 Dados inseridos:');
  console.log('   - 52 usuários (admin, jogador principal + 50 jogadores)');
  console.log('   - 7 partidas abertas');
  console.log('   - 7 quadras (5 aprovadas, 2 pendentes)');
  console.log('   - 4 campeonatos');
}

// MIDDLEWARE
const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT is_admin FROM usuarios WHERE id = ?').get(decoded.userId);
    if (!user || !user.is_admin) return res.status(403).json({ error: 'Acesso negado' });
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// ROTAS AUTH
app.post('/api/auth/register', (req, res) => {
  try {
    const { nome, email, senha, telefone, tipo_usuario, posicao, cidade } = req.body;
    const hashedPassword = bcrypt.hashSync(senha, 10);
    const result = db.prepare(`INSERT INTO usuarios (nome, email, senha, telefone, tipo_usuario, posicao, cidade) VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(nome, email, hashedPassword, telefone, tipo_usuario || 'jogador', posicao, cidade || 'São Paulo');
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(senha, user.senha)) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        nome: user.nome, 
        email: user.email, 
        foto: user.foto, 
        is_admin: user.is_admin, 
        tipo_usuario: user.tipo_usuario 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/me', auth, (req, res) => {
  try {
    const user = db.prepare('SELECT id, nome, email, foto, tipo_usuario, is_admin, reputacao, total_partidas, total_gols, total_assistencias, nivel_habilidade, posicao, cidade FROM usuarios WHERE id = ?').get(req.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROTAS PARTIDAS
app.get('/api/partidas', (req, res) => {
  try {
    const partidas = db.prepare(`
      SELECT p.*, u.nome as organizador_nome, u.foto as organizador_foto 
      FROM partidas p 
      LEFT JOIN usuarios u ON p.organizador_id = u.id 
      ORDER BY p.data_hora ASC
    `).all();
    res.json(partidas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/partidas', auth, (req, res) => {
  try {
    const { titulo, descricao, esporte, data_hora, local, endereco, valor_individual, vagas_totais, nivel_minimo, foto } = req.body;
    const result = db.prepare(`
      INSERT INTO partidas (titulo, descricao, esporte, data_hora, local, endereco, valor_individual, vagas_totais, vagas_disponiveis, nivel_minimo, foto, organizador_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(titulo, descricao, esporte, data_hora, local, endereco, valor_individual, vagas_totais, vagas_totais, nivel_minimo, foto, req.userId);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ROTAS QUADRAS
app.get('/api/quadras', (req, res) => {
  try {
    const quadras = db.prepare('SELECT * FROM quadras WHERE status = ? ORDER BY avaliacoes DESC').all('aprovada');
    res.json(quadras);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/quadras/all', adminAuth, (req, res) => {
  try {
    const quadras = db.prepare('SELECT * FROM quadras ORDER BY created_at DESC').all();
    res.json(quadras);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/quadras', auth, (req, res) => {
  try {
    const { nome, endereco, cidade, esportes, valor_hora, foto, telefone } = req.body;
    const result = db.prepare(`
      INSERT INTO quadras (nome, endereco, cidade, esportes, valor_hora, foto, telefone, dono_id, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendente')
    `).run(nome, endereco, cidade, esportes, valor_hora, foto, telefone, req.userId);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/quadras/:id/status', adminAuth, (req, res) => {
  try {
    const { status } = req.body;
    db.prepare('UPDATE quadras SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ROTAS USUÁRIOS
app.get('/api/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, nome, email, foto, posicao, reputacao, total_partidas, total_gols, total_assistencias, total_avaliacoes, nivel_habilidade, disponivel, cidade FROM usuarios WHERE tipo_usuario = ? ORDER BY reputacao DESC').all('jogador');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROTAS CAMPEONATOS
app.get('/api/campeonatos', (req, res) => {
  try {
    const campeonatos = db.prepare('SELECT * FROM campeonatos ORDER BY created_at DESC').all();
    res.json(campeonatos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/campeonatos', adminAuth, (req, res) => {
  try {
    const { nome, descricao, esporte, valor_inscricao, data_inicio, data_fim, numero_times, foto, premios, regulamento } = req.body;
    const result = db.prepare(`
      INSERT INTO campeonatos (nome, descricao, esporte, valor_inscricao, data_inicio, data_fim, numero_times, foto, premios, regulamento) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(nome, descricao, esporte, valor_inscricao, data_inicio, data_fim, numero_times, foto, premios, regulamento);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/campeonatos/:id/inscrever', auth, (req, res) => {
  try {
    const { nome_time } = req.body;
    const result = db.prepare('INSERT INTO inscricoes_campeonato (campeonato_id, usuario_id, nome_time) VALUES (?, ?, ?)').run(req.params.id, req.userId, nome_time);
    db.prepare('UPDATE campeonatos SET times_inscritos = times_inscritos + 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// STATS
app.get('/api/stats/dashboard', (req, res) => {
  try {
    const stats = {
      totalUsuarios: db.prepare('SELECT COUNT(*) as count FROM usuarios WHERE tipo_usuario = ?').get('jogador').count,
      partidasAbertas: db.prepare("SELECT COUNT(*) as count FROM partidas WHERE status = 'aberta'").get().count,
      totalPartidas: db.prepare('SELECT COUNT(*) as count FROM partidas').get().count,
      totalCampeonatos: db.prepare('SELECT COUNT(*) as count FROM campeonatos').get().count,
      totalQuadras: db.prepare("SELECT COUNT(*) as count FROM quadras WHERE status = 'aprovada'").get().count,
      quadrasPendentes: db.prepare("SELECT COUNT(*) as count FROM quadras WHERE status = 'pendente'").get().count,
      jogadoresAtivos: db.prepare('SELECT COUNT(*) as count FROM usuarios WHERE tipo_usuario = ? AND disponivel = 1').get('jogador').count
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log('✅ Backend Pelada Fácil ONLINE!');
  console.log('📊 API: http://localhost:' + PORT);
  console.log('🔐 Admin: admin@peladafacil.com / admin123');
  console.log('🎮 Jogador: jogador@email.com / jogador123');
  console.log('========================================\n');
});
