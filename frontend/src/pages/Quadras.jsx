import React, { useEffect, useState } from 'react';
import { MapPin, Star, Phone, DollarSign, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Quadras = () => {
  const [quadras, setQuadras] = useState([]);
  const [filtroEsporte, setFiltroEsporte] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    cidade: 'São Paulo',
    esportes: '',
    valor_hora: '',
    foto: '',
    telefone: ''
  });

  useEffect(() => {
    loadQuadras();
  }, []);

  const loadQuadras = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/quadras`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuadras(response.data);
    } catch (error) {
      console.error('Erro ao carregar quadras:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/quadras`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Quadra cadastrada com sucesso! Aguarde aprovação do administrador.');
      setShowModal(false);
      setFormData({
        nome: '',
        endereco: '',
        cidade: 'São Paulo',
        esportes: '',
        valor_hora: '',
        foto: '',
        telefone: ''
      });
    } catch (error) {
      alert('Erro ao cadastrar quadra: ' + error.response?.data?.error);
    }
  };

  const quadrasFiltradas = filtroEsporte === 'todos' 
    ? quadras 
    : quadras.filter(q => q.esportes.includes(filtroEsporte));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Quadras Disponíveis</h1>
          <p className="text-green-100 text-lg">Encontre o espaço perfeito para seu jogo</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2">
            {['todos', 'futebol', 'futsal', 'volei', 'basquete'].map(esporte => (
              <button
                key={esporte}
                onClick={() => setFiltroEsporte(esporte)}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  filtroEsporte === esporte 
                    ? 'bg-green-700 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {esporte.charAt(0).toUpperCase() + esporte.slice(1)}
              </button>
            ))}
          </div>
          {user && (
            <button 
              onClick={() => setShowModal(true)}
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-800 transition shadow-lg"
            >
              Cadastrar Minha Quadra
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quadrasFiltradas.map(quadra => (
            <div key={quadra.id} className="card hover:shadow-xl transition">
              <div className="relative mb-4">
                <img 
                  src={quadra.foto || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600'} 
                  alt={quadra.nome}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-lg">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                    <span className="font-bold text-sm">{quadra.avaliacoes.toFixed(1)}</span>
                    <span className="text-gray-500 text-xs ml-1">({quadra.total_avaliacoes})</span>
                  </div>
                </div>
              </div>
              
              <h3 className="font-bold text-xl mb-2">{quadra.nome}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{quadra.endereco}, {quadra.cidade}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">{quadra.telefone}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {quadra.esportes.split(',').map(esporte => (
                  <span key={esporte} className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    {esporte}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">A partir de</p>
                  <p className="text-2xl font-bold text-green-700">R$ {quadra.valor_hora}/h</p>
                </div>
                <button className="bg-green-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-800 transition">
                  Reservar
                </button>
              </div>
            </div>
          ))}
        </div>

        {quadrasFiltradas.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">Nenhuma quadra encontrada para este esporte</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">Cadastrar Quadra</h2>
              <p className="text-gray-600 mt-1">Preencha os dados da sua quadra</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome da Quadra</label>
                <input
                  type="text"
                  className="input"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Endereço</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.endereco}
                    onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cidade</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.cidade}
                    onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Esportes (separados por vírgula)</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="futebol,futsal,volei"
                    value={formData.esportes}
                    onChange={(e) => setFormData({...formData, esportes: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Valor por Hora (R$)</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.valor_hora}
                    onChange={(e) => setFormData({...formData, valor_hora: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Telefone</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">URL da Foto</label>
                  <input
                    type="url"
                    className="input"
                    placeholder="https://..."
                    value={formData.foto}
                    onChange={(e) => setFormData({...formData, foto: e.target.value})}
                  />
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
                <Shield className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Aprovação Necessária</p>
                  <p>Sua quadra será analisada por nossa equipe antes de ficar disponível na plataforma.</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium"
                >
                  Cadastrar Quadra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quadras;
