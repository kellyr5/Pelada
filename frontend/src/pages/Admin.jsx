import React, { useEffect, useState } from 'react';
import { Users, Calendar, Trophy, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [quadrasPendentes, setQuadrasPendentes] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsRes, quadrasRes] = await Promise.all([
        axios.get(`${API_URL}/stats/dashboard`),
        axios.get(`${API_URL}/quadras/all`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setStats(statsRes.data);
      setQuadrasPendentes(quadrasRes.data.filter(q => q.status === 'pendente'));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const aprovarQuadra = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/quadras/${id}/status`, 
        { status: 'aprovada' },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert('Quadra aprovada com sucesso!');
      loadData();
    } catch (error) {
      alert('Erro ao aprovar quadra');
    }
  };

  const rejeitarQuadra = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/quadras/${id}/status`, 
        { status: 'rejeitada' },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert('Quadra rejeitada');
      loadData();
    } catch (error) {
      alert('Erro ao rejeitar quadra');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-2 rounded-lg font-medium ${
            activeTab === 'dashboard' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('quadras')}
          className={`px-6 py-2 rounded-lg font-medium relative ${
            activeTab === 'quadras' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Aprovar Quadras
          {quadrasPendentes.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {quadrasPendentes.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'dashboard' && stats && (
        <>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <Users className="w-12 h-12 text-green-700 mb-2" />
              <p className="text-3xl font-bold">{stats.totalUsuarios}</p>
              <p className="text-gray-600">Usuários</p>
            </div>
            <div className="card">
              <Calendar className="w-12 h-12 text-blue-700 mb-2" />
              <p className="text-3xl font-bold">{stats.partidasAbertas}</p>
              <p className="text-gray-600">Partidas Abertas</p>
            </div>
            <div className="card">
              <Trophy className="w-12 h-12 text-yellow-700 mb-2" />
              <p className="text-3xl font-bold">{stats.totalCampeonatos}</p>
              <p className="text-gray-600">Campeonatos</p>
            </div>
            <div className="card">
              <MapPin className="w-12 h-12 text-purple-700 mb-2" />
              <p className="text-3xl font-bold">{stats.totalQuadras}</p>
              <p className="text-gray-600">Quadras Ativas</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Estatísticas Gerais</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de Partidas</span>
                <span className="font-bold">{stats.totalPartidas}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quadras Pendentes</span>
                <span className="font-bold text-orange-600">{stats.quadrasPendentes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Jogadores Ativos</span>
                <span className="font-bold text-green-600">{stats.jogadoresAtivos}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'quadras' && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-orange-600 mr-2" />
              <h2 className="text-xl font-bold">Quadras Aguardando Aprovação</h2>
              <span className="ml-3 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {quadrasPendentes.length} pendente(s)
              </span>
            </div>
          </div>

          {quadrasPendentes.length === 0 ? (
            <div className="card text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-xl text-gray-600">Nenhuma quadra pendente de aprovação</p>
            </div>
          ) : (
            quadrasPendentes.map(quadra => (
              <div key={quadra.id} className="card">
                <div className="flex items-start space-x-4">
                  <img 
                    src={quadra.foto || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=200'} 
                    alt={quadra.nome}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{quadra.nome}</h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <p><strong>Endereço:</strong> {quadra.endereco}, {quadra.cidade}</p>
                      <p><strong>Telefone:</strong> {quadra.telefone}</p>
                      <p><strong>Esportes:</strong> {quadra.esportes}</p>
                      <p><strong>Valor/hora:</strong> R$ {quadra.valor_hora}</p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => aprovarQuadra(quadra.id)}
                        className="flex items-center px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => rejeitarQuadra(quadra.id)}
                        className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        Rejeitar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
