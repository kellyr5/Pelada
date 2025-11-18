import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { partidas as partidasService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, DollarSign, Trophy, User, Clock, Shield, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PartidaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [partida, setPartida] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participando, setParticipando] = useState(false);

  useEffect(() => {
    loadPartida();
  }, [id]);

  const loadPartida = async () => {
    try {
      const response = await partidasService.getAll({ limit: 100 });
      const partidaEncontrada = response.data.find(p => p.id === parseInt(id));
      if (partidaEncontrada) {
        setPartida(partidaEncontrada);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar partida:', error);
      setLoading(false);
    }
  };

  const handleParticipar = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setParticipando(true);
    setTimeout(() => {
      alert('Inscrição realizada com sucesso! ⚽');
      setParticipando(false);
      loadPartida();
    }, 1000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!partida) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Partida não encontrada</h2>
          <button onClick={() => navigate('/partidas')} className="btn btn-primary">
            Voltar para Partidas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header com estilo Globo Esporte */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/partidas')}
            className="flex items-center text-white/90 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para partidas
          </button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
                  {partida.esporte}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                  partida.status === 'aberta' ? 'bg-green-400 text-green-900' :
                  partida.status === 'confirmada' ? 'bg-blue-400 text-blue-900' :
                  'bg-gray-400 text-gray-900'
                }`}>
                  {partida.status.toUpperCase()}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-3">{partida.titulo}</h1>
              <div className="flex items-center space-x-6 text-white/90">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {format(new Date(partida.data_hora), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  {format(new Date(partida.data_hora), "HH:mm", { locale: ptBR })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold mb-2">R$ {partida.valor_individual}</div>
              <div className="text-white/80 text-sm">por pessoa</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card de Informações Principais */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Trophy className="w-6 h-6 mr-3 text-primary" />
                Informações da Partida
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 text-primary mt-1" />
                    <div>
                      <div className="font-semibold text-gray-700">Local</div>
                      <div className="text-gray-900">{partida.local}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="w-5 h-5 mr-3 text-primary mt-1" />
                    <div>
                      <div className="font-semibold text-gray-700">Vagas</div>
                      <div className="text-gray-900">
                        {partida.vagas_disponiveis} disponíveis de {partida.vagas_totais} totais
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <DollarSign className="w-5 h-5 mr-3 text-primary mt-1" />
                    <div>
                      <div className="font-semibold text-gray-700">Valor Individual</div>
                      <div className="text-gray-900">R$ {partida.valor_individual}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <User className="w-5 h-5 mr-3 text-primary mt-1" />
                    <div>
                      <div className="font-semibold text-gray-700">Organizador</div>
                      <div className="text-gray-900">Usuário #{partida.organizador_id}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de Descrição */}
            {partida.descricao && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Descrição</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {partida.descricao}
                </p>
              </div>
            )}

            {/* Card de Regras e Observações - Estilo Globo Esporte */}
            <div className="card bg-gradient-to-br from-primary/5 to-primary/10 border-l-4 border-primary">
              <h2 className="text-2xl font-bold mb-4 text-primary flex items-center">
                <Shield className="w-6 h-6 mr-3" />
                Regras e Observações
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></span>
                  <span>Chegue com 15 minutos de antecedência</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></span>
                  <span>Traga caneleira e chuteira/tênis adequado</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></span>
                  <span>Respeite os demais jogadores e o árbitro</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></span>
                  <span>Partida confirmada com mínimo de {Math.floor(partida.vagas_totais * 0.7)} jogadores</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Card de Participação */}
              <div className="card bg-white border-2 border-primary/20">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {partida.vagas_disponiveis}
                  </div>
                  <div className="text-gray-600">vagas disponíveis</div>
                  <div className="mt-4 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-primary-dark h-full transition-all"
                      style={{
                        width: `${((partida.vagas_totais - partida.vagas_disponiveis) / partida.vagas_totais) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    {partida.vagas_totais - partida.vagas_disponiveis} de {partida.vagas_totais} confirmados
                  </div>
                </div>

                {partida.vagas_disponiveis > 0 ? (
                  <button
                    onClick={handleParticipar}
                    disabled={participando}
                    className="w-full btn btn-primary py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    {participando ? 'Inscrevendo...' : 'Participar da Partida'}
                  </button>
                ) : (
                  <div className="w-full bg-gray-200 text-gray-600 py-4 text-center rounded-lg font-bold">
                    Partida Lotada
                  </div>
                )}

                {!user && (
                  <p className="text-sm text-gray-500 text-center mt-4">
                    Faça login para participar
                  </p>
                )}
              </div>

              {/* Card de Estatísticas da Quadra */}
              <div className="card bg-gradient-to-br from-gray-50 to-white">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  Sobre o Local
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo de Piso</span>
                    <span className="font-semibold">Sintético</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cobertura</span>
                    <span className="font-semibold">Sim</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vestiário</span>
                    <span className="font-semibold">Disponível</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estacionamento</span>
                    <span className="font-semibold">Gratuito</span>
                  </div>
                </div>
              </div>

              {/* Card de Informações Adicionais */}
              <div className="card bg-yellow-50 border-yellow-200">
                <h3 className="font-bold text-lg mb-3 text-yellow-900">⚠️ Importante</h3>
                <p className="text-sm text-yellow-800">
                  A confirmação da partida ocorre 24h antes do horário marcado.
                  Você receberá uma notificação por email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartidaDetalhes;
