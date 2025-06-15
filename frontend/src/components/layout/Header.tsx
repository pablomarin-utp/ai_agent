import React from 'react';
import { Menu, Coins } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { credits } = useAuth();

  return (
    <header className="glass-effect border-b border-dark-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-dark-800 rounded-lg border border-dark-600">
            <Coins className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-white">{credits}</span>
            <span className="text-xs text-gray-400">credits</span>
          </div>
        </div>
      </div>
    </header>
  );
};