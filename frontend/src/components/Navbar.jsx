import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Trophy, User, LogOut, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/partidas', label: 'Partidas' },
    { path: '/jogadores', label: 'Jogadores' },
    { path: '/quadras', label: 'Quadras' },
    { path: '/campeonatos', label: 'Campeonatos' }
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Trophy className="w-8 h-8 text-green-700" />
            <span className="font-bold text-xl text-gray-900">Pelada Fácil</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isActive(link.path)
                    ? 'bg-green-700 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.is_admin && (
                  <Link to="/admin" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                    <Shield className="w-5 h-5 mr-2" />
                    Admin
                  </Link>
                )}
                <Link to="/perfil" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                  <User className="w-5 h-5 mr-2" />
                  {user.nome}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium">
                  Entrar
                </Link>
                <Link to="/register" className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium">
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg ${
                  isActive(link.path) ? 'bg-green-700 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                {user.is_admin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    Admin
                  </Link>
                )}
                <Link to="/perfil" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Perfil
                </Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Entrar
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 bg-green-700 text-white rounded-lg text-center">
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
