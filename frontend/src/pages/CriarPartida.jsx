import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { partidas as partidasService, quadras as quadrasService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, DollarSign, Trophy, FileText, ArrowLeft, Plus } from 'lucide-react';

const CriarPartida = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quadras, setQuadras] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    esporte: 'Futebol',
    data_hora: '',
    local: '',
    vagas_totais: 10,
    valor_individual: '',
    nivel_habilidade: 'intermediario',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadQuadras();
  }, [user, navigate]);

  const loadQuadras = async () => {
    try {
      const response = await quadrasService.getAll();
      setQuadras(response.data);
    } catch (error) {
      console.error('Erro ao carregar quadras:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await partidasService.create({
        ...formData,
        vagas_totais: parseInt(formData.vagas_totais),
        valor_individual: parseFloat(formData.valor_individual),
      });

      alert('Partida criada com sucesso! ⚽');
      navigate('/partidas');
    } catch (error) {
      console.error('Erro ao criar partida:', error);
      alert('Erro ao criar partida. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const esportes = ['Futebol', 'Futsal', 'Society', 'Beach Soccer'];
  const niveisHabilidade = [
    { value: 'iniciante', label: 'Iniciante - Para quem está começando' },
    { value: 'intermediario', label: 'Intermediário - Joga regularmente' },
    { value: 'avancado', label: 'Avançado - Alto nível técnico' },
    { value: 'misto', label: 'Misto - Todos os níveis' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header estilo Globo Esporte */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/partidas')}
            className="flex items-center text-white/90 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para partidas
          </button>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <Plus className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Criar Nova Partida</h1>
              <p className="text-white/80 text-lg">Organize sua pelada e chame os amigos!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card de Informações Básicas */}
          <div className="card">
            <div className="flex items-center mb-6">
              <Trophy className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold">Informações Básicas</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título da Partida *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Pelada de Domingo - Arena Central"
                  className="input"
                />
                <p className="text-sm text-gray-500 mt-1">Escolha um título atrativo para sua partida</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Descreva sua partida: horário, regras especiais, o que levar..."
                  className="input resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Esporte *
                  </label>
                  <select
                    name="esporte"
                    value={formData.esporte}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    {esportes.map(esporte => (
                      <option key={esporte} value={esporte}>{esporte}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nível de Habilidade *
                  </label>
                  <select
                    name="nivel_habilidade"
                    value={formData.nivel_habilidade}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    {niveisHabilidade.map(nivel => (
                      <option key={nivel.value} value={nivel.value}>
                        {nivel.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Data e Local */}
          <div className="card">
            <div className="flex items-center mb-6">
              <Calendar className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold">Data e Local</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data e Horário *
                </label>
                <input
                  type="datetime-local"
                  name="data_hora"
                  value={formData.data_hora}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Local da Partida *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="local"
                    value={formData.local}
                    onChange={handleChange}
                    required
                    placeholder="Endereço completo da quadra"
                    className="input pl-11"
                  />
                </div>

                {quadras.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-600 mb-2">Ou escolha uma quadra cadastrada:</p>
                    <div className="grid md:grid-cols-2 gap-2">
                      {quadras.slice(0, 4).map(quadra => (
                        <button
                          key={quadra.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, local: quadra.endereco }))}
                          className="text-left p-3 bg-gray-50 hover:bg-primary/10 border border-gray-200 hover:border-primary rounded-lg transition text-sm"
                        >
                          <div className="font-semibold text-gray-900">{quadra.nome}</div>
                          <div className="text-gray-600 text-xs">{quadra.endereco}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card de Vagas e Valores */}
          <div className="card">
            <div className="flex items-center mb-6">
              <Users className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold">Vagas e Valores</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Total de Vagas *
                </label>
                <input
                  type="number"
                  name="vagas_totais"
                  value={formData.vagas_totais}
                  onChange={handleChange}
                  required
                  min="2"
                  max="50"
                  className="input"
                />
                <p className="text-sm text-gray-500 mt-1">Número total de jogadores</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Valor por Pessoa *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500 font-semibold">R$</span>
                  <input
                    type="number"
                    name="valor_individual"
                    value={formData.valor_individual}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    className="input pl-11"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Valor que cada jogador irá pagar</p>
              </div>
            </div>

            {/* Preview do valor total */}
            {formData.valor_individual && formData.vagas_totais && (
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-l-4 border-primary">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600">Valor Total Arrecadado</div>
                    <div className="text-2xl font-bold text-primary">
                      R$ {(parseFloat(formData.valor_individual) * parseInt(formData.vagas_totais)).toFixed(2)}
                    </div>
                  </div>
                  <DollarSign className="w-12 h-12 text-primary/30" />
                </div>
              </div>
            )}
          </div>

          {/* Card de Dicas - Estilo Globo Esporte */}
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg mb-3 text-blue-900 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              💡 Dicas para uma boa partida
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3"></span>
                <span>Seja claro sobre o nível de habilidade para atrair jogadores compatíveis</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3"></span>
                <span>Confirme a disponibilidade da quadra antes de criar a partida</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3"></span>
                <span>Informe se há vestiário, estacionamento e outros detalhes importantes</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3"></span>
                <span>Considere um valor justo que cubra os custos da quadra</span>
              </li>
            </ul>
          </div>

          {/* Botões de Ação */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/partidas')}
              className="flex-1 btn btn-secondary py-4 text-lg font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn btn-primary py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
            >
              {loading ? 'Criando...' : 'Criar Partida'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CriarPartida;
