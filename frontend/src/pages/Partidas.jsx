import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { partidas as partidasService } from '../services/api';
import { Calendar, MapPin, Users, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Partidas = () => {
  const [partidas, setPartidas] = useState([]);
  const [filtro, setFiltro] = useState('aberta');

  useEffect(() => {
    loadPartidas();
  }, [filtro]);

  const loadPartidas = async () => {
    try {
      const response = await partidasService.getAll({ status: filtro, limit: 50 });
      setPartidas(response.data);
    } catch (error) {
      console.error('Erro ao carregar partidas:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Partidas</h1>
        <Link to="/criar-partida" className="btn btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" /> Criar Partida
        </Link>
      </div>

      <div className="flex space-x-2 mb-6">
        {['aberta', 'confirmada', 'finalizada'].map(status => (
          <button
            key={status}
            onClick={() => setFiltro(status)}
            className={`px-4 py-2 rounded-lg font-medium ${
              filtro === status ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partidas.map(partida => (
          <Link key={partida.id} to={`/partidas/${partida.id}`} className="card hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                {partida.esporte}
              </span>
              <span className="text-sm font-medium text-gray-600">{partida.vagas_disponiveis}/{partida.vagas_totais} vagas</span>
            </div>
            <h3 className="font-bold text-lg mb-3">{partida.titulo}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {format(new Date(partida.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {partida.local}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="text-lg font-bold text-primary">R$ {partida.valor_individual}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                partida.status === 'aberta' ? 'bg-green-100 text-green-800' :
                partida.status === 'confirmada' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {partida.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Partidas;
