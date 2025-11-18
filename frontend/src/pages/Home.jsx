import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, Star, ArrowRight, MapPin, Clock, Medal, TrendingUp } from 'lucide-react';
import { partidas, stats, users } from '../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Home = () => {
  const [proximasPartidas, setProximasPartidas] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [topJogadores, setTopJogadores] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [partidasRes, statsRes, usersRes] = await Promise.all([
        partidas.getAll(),
        stats.getDashboard(),
        users.getAll()
      ]);
      setProximasPartidas(partidasRes.data.filter(p => p.status === 'aberta').slice(0, 3));
      setStatistics(statsRes.data);
      setTopJogadores(usersRes.data.slice(0, 4));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <TrendingUp className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Mais de 65 milhões de atletas no Brasil</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                A Revolução do Esporte Amador
              </h1>
              <p className="text-xl mb-8 text-green-50">
                Organize partidas, encontre jogadores disponíveis, participe de campeonatos e evolua suas habilidades. Tudo em um só lugar!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/partidas" className="bg-white text-green-700 px-8 py-4 rounded-lg font-bold hover:bg-green-50 transition shadow-lg">
                  Ver Partidas Abertas
                </Link>
                <Link to="/register" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition backdrop-blur-sm">
                  Criar Conta Grátis
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop" 
                alt="Futebol"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-6 rounded-xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Users className="w-8 h-8 text-green-700" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{statistics?.totalUsuarios || 0}</p>
                    <p className="text-gray-600">Jogadores ativos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {statistics && (
        <div className="bg-white py-12 -mt-10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="card text-center hover:shadow-lg transition">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-green-700" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{statistics.jogadoresAtivos}</p>
                <p className="text-gray-600 font-medium">Jogadores Disponíveis</p>
              </div>
              <div className="card text-center hover:shadow-lg transition">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-8 h-8 text-blue-700" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{statistics.partidasAbertas}</p>
                <p className="text-gray-600 font-medium">Partidas Abertas</p>
              </div>
              <div className="card text-center hover:shadow-lg transition">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-8 h-8 text-yellow-700" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{statistics.totalCampeonatos}</p>
                <p className="text-gray-600 font-medium">Campeonatos</p>
              </div>
              <div className="card text-center hover:shadow-lg transition">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-8 h-8 text-purple-700" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{statistics.totalQuadras}</p>
                <p className="text-gray-600 font-medium">Quadras Cadastradas</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Por que escolher o Pelada Fácil?</h2>
            <p className="text-xl text-gray-600">A plataforma completa para o esporte amador</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card hover:shadow-xl transition group">
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Users className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Mercado de Jogadores</h3>
              <p className="text-gray-600 leading-relaxed">Encontre jogadores disponíveis na sua região em segundos. Sistema de ranking e avaliações para garantir a qualidade dos times.</p>
            </div>
            <div className="card hover:shadow-xl transition group">
              <div className="bg-yellow-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Medal className="w-8 h-8 text-yellow-700" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Gamificação Completa</h3>
              <p className="text-gray-600 leading-relaxed">Acompanhe estatísticas detalhadas, conquiste troféus e suba no ranking. Transforme sua paixão em evolução constante!</p>
            </div>
            <div className="card hover:shadow-xl transition group">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Calendar className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Organização Simples</h3>
              <p className="text-gray-600 leading-relaxed">Crie partidas e campeonatos com poucos cliques. Sistema de pagamentos integrado e gestão automatizada.</p>
            </div>
          </div>
        </div>
      </div>

      {topJogadores.length > 0 && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold">Jogadores em Destaque</h2>
                <p className="text-gray-600 mt-2">Os melhores atletas da plataforma</p>
              </div>
              <Link to="/jogadores" className="flex items-center text-green-700 hover:text-green-800 font-medium">
                Ver todos <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {topJogadores.map((jogador, index) => (
                <div key={jogador.id} className="card hover:shadow-lg transition">
                  <div className="relative">
                    {index === 0 && (
                      <div className="absolute -top-3 -right-3 bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg">
                        1
                      </div>
                    )}
                    <img src={jogador.foto} alt={jogador.nome} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-100" />
                  </div>
                  <h3 className="font-bold text-lg text-center mb-1">{jogador.nome}</h3>
                  <p className="text-sm text-gray-600 text-center mb-3">{jogador.posicao}</p>
                  <div className="flex items-center justify-center mb-3">
                    <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                    <span className="font-bold">{jogador.reputacao.toFixed(1)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="font-bold text-green-700">{jogador.total_gols}</p>
                      <p className="text-gray-600">Gols</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="font-bold text-blue-700">{jogador.total_assistencias}</p>
                      <p className="text-gray-600">Assist.</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="font-bold text-purple-700">{jogador.total_partidas}</p>
                      <p className="text-gray-600">Jogos</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Próximas Partidas</h2>
              <p className="text-gray-600 mt-2">Participe dos melhores jogos da sua região</p>
            </div>
            <Link to="/partidas" className="flex items-center text-green-700 hover:text-green-800 font-medium">
              Ver todas <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {proximasPartidas.map(partida => (
              <div key={partida.id} className="card hover:shadow-xl transition cursor-pointer group" onClick={() => window.location.href = `/partidas`}>
                <div className="flex justify-between items-start mb-4">
                  <span className="px-4 py-2 bg-green-100 text-green-800 text-sm rounded-full font-bold uppercase">
                    {partida.esporte}
                  </span>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Vagas</p>
                    <p className="text-lg font-bold text-green-700">{partida.vagas_disponiveis}/{partida.vagas_totais}</p>
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-green-700 transition">{partida.titulo}</h3>
                <div className="space-y-3 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="font-medium">{format(new Date(partida.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{partida.local}</span>
                  </div>
                  <div className="flex items-center">
                    <img src={partida.organizador_foto} alt="" className="w-6 h-6 rounded-full mr-3 border-2 border-gray-200" />
                    <span>{partida.organizador_nome}</span>
                  </div>
                </div>
                <div className="pt-4 border-t flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Valor por pessoa</p>
                    <p className="text-2xl font-bold text-green-700">R$ {partida.valor_individual}</p>
                  </div>
                  <button className="bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition">
                    Participar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <Trophy className="w-20 h-20 mx-auto mb-6 opacity-90" />
          <h2 className="text-5xl font-bold mb-6">Pronto para jogar?</h2>
          <p className="text-2xl mb-10 text-green-100">Junte-se a milhares de atletas amadores e leve seu jogo para o próximo nível!</p>
          <Link to="/register" className="inline-block bg-white text-green-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-green-50 transition shadow-2xl">
            Comece Agora - É Grátis!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
