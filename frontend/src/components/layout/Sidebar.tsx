import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  MessageSquare,
  User,
  BarChart3,
  Settings,
  Users,
  FileText,
  LogOut,
  Bot,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: BarChart3, label: 'Usage', path: '/usage' },
  ];

  const adminItems = [
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: FileText, label: 'Logs', path: '/admin/logs' },
    { icon: Settings, label: 'Config', path: '/admin/config' },
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="fixed top-0 left-0 z-50 w-70 h-full glass-effect border-r border-dark-700 lg:translate-x-0 lg:static lg:w-64"
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Assistant</h1>
              <p className="text-xs text-gray-400">Futuristic AI Platform</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {user?.is_admin && (
              <div className="mt-8">
                <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Administration
                </h3>
                <div className="space-y-2">
                  {adminItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                            : 'text-gray-300 hover:text-white hover:bg-dark-800'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-dark-700 pt-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.is_admin ? 'Administrator' : 'User'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-gray-300 hover:text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};