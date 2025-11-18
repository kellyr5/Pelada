import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, Users, DollarSign, Award, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const API_URL = 'http://localhost:5000/api';

const Campeonatos = () => {
  const [campeonatos, setCampeonatos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [campeonatoSelecionado, setCampeonatoSelecionado] = useState(null);
  const [nomeTime, setNomeTime] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadCampeonatos();
  }, []);

  const loadCampeonatos = async () => {
    try {
      const response = await axios.get(`${API_URL}/campeonatos`);
      setCampeonatos(response.data);
    } catch (error) {
      console.error('Erro ao carregar campeonatos:', error);
    }
  };

  const handleInscrever = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Você precisa estar logado para se inscrever');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/campeonatos/${campeonatoSelecionado.id}/inscrever`, 
        { nome_time: nomeTime },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert('Inscrição realizada com sucesso!');
      setShowModal(false);
      setNomeTime('');
      loadCampeonatos();
    } catch (error) {
      alert('Erro ao realizar inscrição: ' + error.response?.data?.error);
    }
  };

  const campeonatosFiltrados = filtroStatus === 'todos' 
    ? campeonatos 
    : campeonatos.filter(c => c.status === filtroStatus);

  const getStatusBadge = (status) => {
    const badges = {
      'inscricoes_abertas': 'bg-green-100 text-green-800',
      'em_andamento': 'bg-blue-100 text-blue-800',
      'finalizado': 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      'inscricoes_abertas': 'Inscrições Abertas',
      'em_andamento': 'Em Andamento',
      'finalizado': 'Finalizado'
    };
    return texts[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-4">
            <Trophy className="w-12 h-12 mr-4" />
            <div>
              <h1 className="text-4xl font-bold">Campeonatos</h1>
              <p className="text-yellow-100 text-lg mt-2">Compete e mostre seu talento</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {['todos', 'inscricoes_abertas', 'em_andamento', 'finalizado'].map(status => (
            <button
              key={status}
              onClick={() => setFiltroStatus(status)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                filtroStatus === status 
                  ? 'bg-yellow-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {status === 'todos' ? 'Todos' : getStatusText(status)}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campeonatosFiltrados.map(campeonato => (
            <div key={campeonato.id} className="card hover:shadow-xl transition">
              <div className="relative mb-4">
                <img 
                  src={campeonato.foto || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600'} 
                  alt={campeonato.nome}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(campeonato.status)}`}>
                    {getStatusText(campeonato.status)}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium uppercase">
                  {campeonato.esporte}
                </span>
              </div>

              <h3 className="font-bold text-xl mb-2">{campeonato.nome}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campeonato.descricao}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {format(new Date(campeonato.data_inicio), 'dd/MM/yyyy', { locale: ptBR })} - {' '}
                    {format(new Date(campeonato.data_fim), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{campeonato.times_inscritos}/{campeonato.numero_times} times inscritos</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Award className="w-4 h-4 mr-2" />
                  <span>{campeonato.premios || 'Premiação a definir'}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Taxa de Inscrição</p>
                    <p className="text-2xl font-bold text-yellow-600">R$ {campeonato.valor_inscricao}</p>
                  </div>
                  {campeonato.status === 'inscricoes_abertas' && (
                    <button 
                      onClick={() => {
                        setCampeonatoSelecionado(campeonato);
                        setShowModal(true);
                      }}
                      className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-700 transition"
                    >
                      Inscrever
                    </button>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full transition-all"
                    style={{ width: `${(campeonato.times_inscritos / campeonato.numero_times) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {campeonatosFiltrados.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">Nenhum campeonato encontrado</p>
          </div>
        )}
      </div>

      {showModal && campeonatoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">Inscrever Time</h2>
              <p className="text-gray-600 mt-1">{campeonatoSelecionado.nome}</p>
            </div>
            <form onSubmit={handleInscrever} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Time</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ex: FC Barcelona Amador"
                  value={nomeTime}
                  onChange={(e) => setNomeTime(e.target.value)}
                  required
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <DollarSign className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Valor da Inscrição</p>
                    <p className="text-2xl font-bold">R$ {campeonatoSelecionado.valor_inscricao}</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                <p className="font-medium mb-1">Informações Importantes</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Leia o regulamento completo antes de se inscrever</li>
                  <li>A inscrição será confirmada após o pagamento</li>
                  <li>Vagas limitadas a {campeonatoSelecionado.numero_times} times</li>
                </ul>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setNomeTime('');
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium"
                >
                  Confirmar Inscrição
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campeonatos;
