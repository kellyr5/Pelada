const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const db = new Database('pelada-facil.db');

// Criar tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    telefone TEXT,
    foto TEXT,
    posicao TEXT,
    pe_preferido TEXT,
    idade INTEGER,
    altura REAL,
    peso REAL,
    cidade TEXT,
    estado TEXT,
    bio TEXT,
    nivel_habilidade INTEGER DEFAULT 3,
    reputacao REAL DEFAULT 5.0,
    total_avaliacoes INTEGER DEFAULT 0,
    total_partidas INTEGER DEFAULT 0,
    total_gols INTEGER DEFAULT 0,
    total_assistencias INTEGER DEFAULT 0,
    total_vitorias INTEGER DEFAULT 0,
    cartoes_amarelos INTEGER DEFAULT 0,
    cartoes_vermelhos INTEGER DEFAULT 0,
    disponivel BOOLEAN DEFAULT 1,
    is_admin BOOLEAN DEFAULT 0,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS partidas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    organizador_id INTEGER,
    esporte TEXT DEFAULT 'futebol',
    tipo TEXT DEFAULT 'pelada',
    data_hora DATETIME NOT NULL,
    duracao INTEGER DEFAULT 90,
    local TEXT NOT NULL,
    endereco TEXT,
    latitude REAL,
    longitude REAL,
    vagas_totais INTEGER DEFAULT 22,
    vagas_disponiveis INTEGER DEFAULT 22,
    valor_individual REAL DEFAULT 0,
    nivel_minimo INTEGER DEFAULT 1,
    status TEXT DEFAULT 'aberta',
    observacoes TEXT,
    criada_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizador_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS inscricoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partida_id INTEGER,
    jogador_id INTEGER,
    status TEXT DEFAULT 'confirmado',
    posicao_preferida TEXT,
    pagamento_status TEXT DEFAULT 'pendente',
    data_inscricao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (partida_id) REFERENCES partidas(id),
    FOREIGN KEY (jogador_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS avaliacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    avaliador_id INTEGER,
    avaliado_id INTEGER,
    partida_id INTEGER,
    nota INTEGER CHECK(nota >= 1 AND nota <= 5),
    comentario TEXT,
    criada_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (avaliador_id) REFERENCES usuarios(id),
    FOREIGN KEY (avaliado_id) REFERENCES usuarios(id),
    FOREIGN KEY (partida_id) REFERENCES partidas(id)
  );

  CREATE TABLE IF NOT EXISTS campeonatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    organizador_id INTEGER,
    esporte TEXT DEFAULT 'futebol',
    tipo_campeonato TEXT DEFAULT 'eliminatorio',
    data_inicio DATE,
    data_fim DATE,
    numero_times INTEGER,
    valor_inscricao REAL DEFAULT 0,
    premiacao TEXT,
    regulamento TEXT,
    status TEXT DEFAULT 'inscricoes_abertas',
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizador_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS times (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    sigla TEXT,
    logo TEXT,
    capitao_id INTEGER,
    campeonato_id INTEGER,
    pontos INTEGER DEFAULT 0,
    vitorias INTEGER DEFAULT 0,
    empates INTEGER DEFAULT 0,
    derrotas INTEGER DEFAULT 0,
    gols_pro INTEGER DEFAULT 0,
    gols_contra INTEGER DEFAULT 0,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (capitao_id) REFERENCES usuarios(id),
    FOREIGN KEY (campeonato_id) REFERENCES campeonatos(id)
  );

  CREATE TABLE IF NOT EXISTS notificacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    tipo TEXT,
    titulo TEXT,
    mensagem TEXT,
    lida BOOLEAN DEFAULT 0,
    link TEXT,
    criada_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS conquistas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    tipo TEXT,
    titulo TEXT,
    descricao TEXT,
    icone TEXT,
    desbloqueada_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  );
`);

// Função para popular banco com dados realistas
function popularBanco() {
  const nomes = [
    'Carlos Silva', 'João Santos', 'Pedro Oliveira', 'Lucas Ferreira', 'Bruno Costa',
    'Rafael Lima', 'Felipe Souza', 'Rodrigo Alves', 'Marcos Pereira', 'André Martins',
    'Gabriel Rocha', 'Thiago Ribeiro', 'Diego Carvalho', 'Matheus Dias', 'Vinicius Castro',
    'Fernando Gomes', 'Eduardo Barbosa', 'Gustavo Cardoso', 'Leonardo Machado', 'Ricardo Mendes',
    'Henrique Moreira', 'Renato Araújo', 'Fabio Correia', 'Paulo Teixeira', 'Alexandre Freitas',
    'Marcelo Pinto', 'Leandro Monteiro', 'Danilo Lopes', 'Anderson Vieira', 'Igor Fernandes',
    'Caio Nunes', 'Murilo Barros', 'Julio Campos', 'Renan Duarte', 'Wesley Ramos',
    'Patrick Melo', 'Nicolas Cavalcanti', 'Hugo Moura', 'Arthur Castro', 'Enzo Silveira'
  ];

  const posicoes = ['Goleiro', 'Zagueiro', 'Lateral', 'Volante', 'Meia', 'Atacante'];
  const cidades = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre', 'Curitiba', 'Brasília'];
  const fotos = [
    'https://i.pravatar.cc/150?img=1', 'https://i.pravatar.cc/150?img=2', 
    'https://i.pravatar.cc/150?img=3', 'https://i.pravatar.cc/150?img=4',
    'https://i.pravatar.cc/150?img=5', 'https://i.pravatar.cc/150?img=6',
    'https://i.pravatar.cc/150?img=7', 'https://i.pravatar.cc/150?img=8',
    'https://i.pravatar.cc/150?img=9', 'https://i.pravatar.cc/150?img=10'
  ];

  // Inserir usuário admin
  const senhaHash = bcrypt.hashSync('admin123', 10);
  const insertAdmin = db.prepare(`
    INSERT INTO usuarios (nome, email, senha, telefone, foto, posicao, pe_preferido, idade, altura, peso, cidade, estado, bio, nivel_habilidade, reputacao, is_admin, total_partidas, total_gols)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertAdmin.run(
    'Admin Sistema',
    'admin@peladafacil.com',
    senhaHash,
    '(11) 99999-9999',
    'https://i.pravatar.cc/150?img=50',
    'Meia',
    'Direito',
    28,
    1.78,
    75,
    'São Paulo',
    'SP',
    'Administrador da plataforma Pelada Fácil',
    5,
    5.0,
    1,
    150,
    45
  );

  // Inserir 40 jogadores
  const insertUser = db.prepare(`
    INSERT INTO usuarios (nome, email, senha, telefone, foto, posicao, pe_preferido, idade, altura, peso, cidade, estado, bio, nivel_habilidade, reputacao, total_avaliacoes, total_partidas, total_gols, total_assistencias, disponivel)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  nomes.forEach((nome, i) => {
    const email = nome.toLowerCase().replace(' ', '.') + '@email.com';
    const senha = bcrypt.hashSync('senha123', 10);
    const posicao = posicoes[Math.floor(Math.random() * posicoes.length)];
    const cidade = cidades[Math.floor(Math.random() * cidades.length)];
    const foto = fotos[i % fotos.length];
    
    insertUser.run(
      nome,
      email,
      senha,
      `(11) 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
      foto,
      posicao,
      Math.random() > 0.5 ? 'Direito' : 'Esquerdo',
      20 + Math.floor(Math.random() * 25),
      1.65 + Math.random() * 0.25,
      60 + Math.floor(Math.random() * 30),
      cidade,
      'SP',
      `Jogador de ${posicao.toLowerCase()}, apaixonado por futebol e sempre disponível para uma boa pelada!`,
      1 + Math.floor(Math.random() * 5),
      3.5 + Math.random() * 1.5,
      Math.floor(Math.random() * 50),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 30),
      Math.floor(Math.random() * 20),
      Math.random() > 0.3 ? 1 : 0
    );
  });

  // Inserir partidas (20 partidas)
  const insertPartida = db.prepare(`
    INSERT INTO partidas (titulo, descricao, organizador_id, esporte, tipo, data_hora, local, endereco, vagas_totais, vagas_disponiveis, valor_individual, nivel_minimo, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const locais = [
    'Arena São Paulo', 'Campo do Morumbi', 'Quadra Pacaembu', 'Sociedade Esportiva Palmeiras',
    'Centro Olímpico', 'Campo da Vila Maria', 'Ginásio Ibirapuera', 'Arena Itaquera',
    'Complexo Esportivo Jabaquara', 'Quadra Tatuapé'
  ];

  for (let i = 0; i < 20; i++) {
    const dataFutura = new Date();
    dataFutura.setDate(dataFutura.getDate() + Math.floor(Math.random() * 30));
    const vagas = 10 + Math.floor(Math.random() * 12);
    const vagasDisponiveis = Math.floor(Math.random() * vagas);
    
    insertPartida.run(
      `Pelada ${i + 1} - ${locais[i % locais.length]}`,
      `Partida descontraída de futebol. Todos os níveis são bem-vindos!`,
      1 + Math.floor(Math.random() * 40),
      Math.random() > 0.2 ? 'futebol' : (Math.random() > 0.5 ? 'futsal' : 'volei'),
      Math.random() > 0.3 ? 'pelada' : 'amistoso',
      dataFutura.toISOString(),
      locais[i % locais.length],
      `Rua Exemplo, ${Math.floor(Math.random() * 1000)} - São Paulo, SP`,
      vagas,
      vagasDisponiveis,
      15 + Math.floor(Math.random() * 35),
      1 + Math.floor(Math.random() * 3),
      vagasDisponiveis > 0 ? 'aberta' : (Math.random() > 0.5 ? 'confirmada' : 'cancelada')
    );
  }

  // Inserir inscrições
  const insertInscricao = db.prepare(`
    INSERT INTO inscricoes (partida_id, jogador_id, status, posicao_preferida, pagamento_status)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (let i = 1; i <= 20; i++) {
    const numInscricoes = 5 + Math.floor(Math.random() * 15);
    for (let j = 0; j < numInscricoes; j++) {
      insertInscricao.run(
        i,
        2 + Math.floor(Math.random() * 39),
        Math.random() > 0.1 ? 'confirmado' : 'pendente',
        posicoes[Math.floor(Math.random() * posicoes.length)],
        Math.random() > 0.3 ? 'pago' : 'pendente'
      );
    }
  }

  // Inserir campeonatos
  const insertCampeonato = db.prepare(`
    INSERT INTO campeonatos (nome, descricao, organizador_id, esporte, tipo_campeonato, data_inicio, data_fim, numero_times, valor_inscricao, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const nomesCampeonatos = [
    'Copa Pelada Fácil 2025',
    'Torneio Zona Norte',
    'Campeonato Amador SP',
    'Liga Futsal Metropolitana',
    'Copa Vôlei de Areia'
  ];

  nomesCampeonatos.forEach((nome, i) => {
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() + 10 + i * 7);
    const dataFim = new Date(dataInicio);
    dataFim.setDate(dataFim.getDate() + 60);
    
    insertCampeonato.run(
      nome,
      `Campeonato amador disputado em ${dataInicio.getFullYear()}. Premiação para os 3 primeiros colocados!`,
      1,
      i === 4 ? 'volei' : (i === 3 ? 'futsal' : 'futebol'),
      Math.random() > 0.5 ? 'eliminatorio' : 'pontos_corridos',
      dataInicio.toISOString().split('T')[0],
      dataFim.toISOString().split('T')[0],
      8 + Math.floor(Math.random() * 8),
      200 + Math.floor(Math.random() * 300),
      i < 2 ? 'inscricoes_abertas' : (i < 4 ? 'em_andamento' : 'finalizado')
    );
  });

  // Inserir notificações
  const insertNotificacao = db.prepare(`
    INSERT INTO notificacoes (usuario_id, tipo, titulo, mensagem, lida)
    VALUES (?, ?, ?, ?, ?)
  `);

  const tiposNotif = ['partida', 'convite', 'avaliacao', 'pagamento', 'conquista'];
  for (let i = 0; i < 50; i++) {
    insertNotificacao.run(
      2 + Math.floor(Math.random() * 39),
      tiposNotif[Math.floor(Math.random() * tiposNotif.length)],
      'Nova notificação',
      'Você tem uma nova atualização na plataforma!',
      Math.random() > 0.5 ? 1 : 0
    );
  }

  console.log('✅ Banco de dados populado com sucesso!');
}

// Popular banco ao iniciar
try {
  const count = db.prepare('SELECT COUNT(*) as total FROM usuarios').get();
  if (count.total === 0) {
    popularBanco();
  }
} catch (error) {
  console.log('Iniciando população do banco...');
  popularBanco();
}

module.exports = db;
