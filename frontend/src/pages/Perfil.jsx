import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { users } from '../services/api';
import { Edit2, Save, Trophy, Target, Award } from 'lucide-react';

const Perfil = () => {
  const { user, setUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    telefone: user?.telefone || '',
    posicao: user?.posicao || '',
    pe_preferido: user?.pe_preferido || '',
    idade: user?.idade || '',
    altura: user?.altura || '',
    peso: user?.peso || '',
    cidade: user?.cidade || '',
    bio: user?.bio || '',
    disponivel: user?.disponivel || 1
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSave = async () => {
    try {
      await users.update(formData);
      const response = await users.getMe();
      setUser(response.data);
      setEditMode(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar perfil');
    }
  };

  if (!user) return <div>Carregando...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        {!editMode ? (
          <button onClick={() => setEditMode(true)} className="btn btn-primary flex items-center">
            <Edit2 className="w-5 h-5 mr-2" /> Editar Perfil
          </button>
        ) : (
          <div className="space-x-2">
            <button onClick={handleSave} className="btn btn-primary flex items-center inline-flex">
              <Save className="w-5 h-5 mr-2" /> Salvar
            </button>
            <button onClick={() => setEditMode(false)} className="btn btn-secondary">Cancelar</button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Coluna esquerda - Info básica */}
        <div className="md:col-span-1">
          <div className="card text-center">
            <img src={user.foto || 'https://i.pravatar.cc/150'} alt={user.nome} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
            <h2 className="text-2xl font-bold mb-2">{user.nome}</h2>
            <p className="text-gray-600 mb-4">{user.posicao || 'Posição não definida'}</p>
            
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-5 h-5 text-yellow-500 mr-1" />
              <span className="text-lg font-bold">{user.reputacao.toFixed(1)}</span>
              <span className="text-sm text-gray-500 ml-1">({user.total_avaliacoes})</span>
            </div>

            <div className="flex items-center justify-center space-x-2 mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="disponivel"
                  checked={editMode ? formData.disponivel : user.disponivel}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="mr-2"
                />
                <span className={`text-sm font-medium ${user.disponivel ? 'text-green-600' : 'text-gray-600'}`}>
                  {user.disponivel ? 'Disponível' : 'Indisponível'}
                </span>
              </label>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="card mt-6">
            <h3 className="font-bold mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-primary" />
              Estatísticas
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Partidas:</span>
                <span className="font-bold">{user.total_partidas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gols:</span>
                <span className="font-bold text-primary">{user.total_gols}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Assistências:</span>
                <span className="font-bold text-secondary">{user.total_assistencias}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vitórias:</span>
                <span className="font-bold text-green-600">{user.total_vitorias}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna direita - Detalhes */}
        <div className="md:col-span-2">
          <div className="card">
            <h3 className="font-bold text-xl mb-6">Informações Pessoais</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                <input
                  type="text"
                  name="nome"
                  className="input"
                  value={formData.nome}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input
                  type="tel"
                  name="telefone"
                  className="input"
                  value={formData.telefone}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Posição</label>
                <select
                  name="posicao"
                  className="input"
                  value={formData.posicao}
                  onChange={handleChange}
                  disabled={!editMode}
                >
                  <option value="">Selecione...</option>
                  <option value="Goleiro">Goleiro</option>
                  <option value="Zagueiro">Zagueiro</option>
                  <option value="Lateral">Lateral</option>
                  <option value="Volante">Volante</option>
                  <option value="Meia">Meia</option>
                  <option value="Atacante">Atacante</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pé Preferido</label>
                <select
                  name="pe_preferido"
                  className="input"
                  value={formData.pe_preferido}
                  onChange={handleChange}
                  disabled={!editMode}
                >
                  <option value="">Selecione...</option>
                  <option value="Direito">Direito</option>
                  <option value="Esquerdo">Esquerdo</option>
                  <option value="Ambidestro">Ambidestro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idade</label>
                <input
                  type="number"
                  name="idade"
                  className="input"
                  value={formData.idade}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                <input
                  type="text"
                  name="cidade"
                  className="input"
                  value={formData.cidade}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Altura (m)</label>
                <input
                  type="number"
                  step="0.01"
                  name="altura"
                  className="input"
                  value={formData.altura}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                <input
                  type="number"
                  name="peso"
                  className="input"
                  value={formData.peso}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                name="bio"
                className="input"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="Conte um pouco sobre você e sua paixão pelo esporte..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
