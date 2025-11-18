import React, { useEffect, useState } from 'react';
import { Star, MapPin, Award, TrendingUp, Filter, Search } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Jogadores = () => {
  const [jogadores, setJogadores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroPosicao, setFiltroPosicao] = useState('todas');
  const [filtroCidade, setFiltroCidade] = useState('todas');
  const [ordenacao, setOrdenacao] = useState('reputacao');

  useEffect(() => {
    loadJogadores();
  }, []);

  const loadJogadores = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setJogadores(response.data);
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error);
    }
  };

  const posicoes = ['todas', 'Goleiro', 'Zagueiro', 'Lateral', 'Volante', 'Meia', 'Atacante'];
  const cidades = ['todas', ...new Set(jogadores.map(j => j.cidade))];

  const jogadoresFiltrados = jogadores
    .filter(j => {
      const matchNome = j.nome.toLowerCase().includes(filtro.toLowerCase());
      const matchPosicao = filtroPosicao === 'todas' || j.posicao === filtroPosicao;
      const matchCidade = filtroCidade === 'todas' || j.cidade === filtroCidade;
      return matchNome && matchPosicao && matchCidade;
    })
    .sort((a, b) => {
      if (ordenacao === 'reputacao') return b.reputacao - a.reputacao;
      if (ordenacao === 'gols') return b.total_gols - a.total_gols;
      if (ordenacao === 'partidas') return b.total_partidas - a.total_partidas;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-4">
            <Award className="w-12 h-12 mr-4" />
            <div>
              <h1 className="text-4xl font-bold">Mercado de Jogadores</h1>
              <p className="text-blue-100 text-lg mt-2">Encontre os melhores atletas para seu time</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="card mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Buscar Jogador</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Nome do jogador..."
                  className="input pl-10"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Posição</label>
              <select 
                className="input"
                value={filtroPosicao}
                onChange={(e) => setFiltroPosicao(e.target.value)}
              >
                {posicoes.map(pos => (
                  <option key={pos} value={pos}>
                    {pos.charAt(0).toUpperCase() + pos.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cidade</label>
              <select 
                className="input"
                value={filtroCidade}
                onChange={(e) => setFiltroCidade(e.target.value)}
              >
                {cidades.map(cidade => (
                  <option key={cidade} value={cidade}>
                    {cidade.charAt(0).toUpperCase() + cidade.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {jogadoresFiltrados.length} jogador(es) encontrado(s)
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Ordenar por:</span>
              <select 
                className="input py-1"
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
              >
                <option value="reputacao">Reputação</option>
                <option value="gols">Gols</option>
                <option value="partidas">Partidas</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jogadoresFiltrados.map((jogador, index) => (
            <div key={jogador.id} className="card hover:shadow-xl transition">
              <div className="flex items-start space-x-4 mb-4">
                <div className="relative">
                  <img 
                    src={jogador.foto} 
                    alt={jogador.nome} 
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-100" 
                  />
                  {jogador.disponivel === 1 && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{jogador.nome}</h3>
                  <p className="text-sm text-gray-600 mb-1">{jogador.posicao || 'Posição não informada'}</p>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                    <span className="text-sm font-bold">{jogador.reputacao.toFixed(1)}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({jogador.total_avaliacoes || 0} avaliações)
                    </span>
                  </div>
                </div>
                {index < 3 && (
                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                    TOP {index + 1}
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {jogador.cidade || 'Cidade não informada'}
                </div>
                <div className="flex items-center text-gray-600">
                  <Award className="w-4 h-4 mr-2" />
                  {jogador.total_partidas} partidas jogadas
                </div>
                <div className="flex items-center text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Nível {jogador.nivel_habilidade} de habilidade
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{jogador.total_gols}</p>
                  <p className="text-xs text-gray-600 mt-1">Gols</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-blue-700">{jogador.total_assistencias}</p>
                  <p className="text-xs text-gray-600 mt-1">Assistências</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-purple-700">{jogador.nivel_habilidade}</p>
                  <p className="text-xs text-gray-600 mt-1">Nível</p>
                </div>
              </div>

              <button className="btn btn-primary w-full">
                Convocar Jogador
              </button>
            </div>
          ))}
        </div>

        {jogadoresFiltrados.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">Nenhum jogador encontrado</p>
            <p className="text-gray-400 mt-2">Tente ajustar os filtros de busca</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jogadores;
