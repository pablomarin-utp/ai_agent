import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Shield, 
  ShieldOff, 
  Trash2,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  last_login?: string;
}

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'activate' | 'deactivate' | 'admin' | 'delete' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers: User[] = Array.from({ length: 25 }, (_, i) => ({
        id: `user-${i + 1}`,
        email: `user${i + 1}@example.com`,
        is_active: Math.random() > 0.2,
        is_admin: i < 3,
        created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        last_login: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      }));

      setUsers(mockUsers);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.is_active) ||
      (statusFilter === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const handleUserAction = async () => {
    if (!selectedUser || !actionType) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      let updateData: Partial<User> = {};
      let successMessage = '';

      switch (actionType) {
        case 'activate':
          updateData = { is_active: true };
          successMessage = 'User activated successfully';
          break;
        case 'deactivate':
          updateData = { is_active: false };
          successMessage = 'User deactivated successfully';
          break;
        case 'admin':
          updateData = { is_admin: !selectedUser.is_admin };
          successMessage = selectedUser.is_admin ? 'Admin privileges removed' : 'Admin privileges granted';
          break;
        case 'delete':
          setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
          toast.success('User deleted successfully');
          closeModal();
          return;
      }

      setUsers(prev => 
        prev.map(user => 
          user.id === selectedUser.id 
            ? { ...user, ...updateData }
            : user
        )
      );

      toast.success(successMessage);
      closeModal();
    } catch (error) {
      toast.error('Action failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openActionModal = (user: User, action: typeof actionType) => {
    setSelectedUser(user);
    setActionType(action);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setActionType(null);
    setIsSubmitting(false);
  };

  const getActionTitle = () => {
    if (!actionType || !selectedUser) return '';
    
    switch (actionType) {
      case 'activate':
        return 'Activate User';
      case 'deactivate':
        return 'Deactivate User';
      case 'admin':
        return selectedUser.is_admin ? 'Remove Admin' : 'Grant Admin';
      case 'delete':
        return 'Delete User';
      default:
        return '';
    }
  };

  const getActionMessage = () => {
    if (!actionType || !selectedUser) return '';
    
    switch (actionType) {
      case 'activate':
        return `Are you sure you want to activate ${selectedUser.email}? They will be able to log in and use the service.`;
      case 'deactivate':
        return `Are you sure you want to deactivate ${selectedUser.email}? They will not be able to log in.`;
      case 'admin':
        return selectedUser.is_admin 
          ? `Remove admin privileges from ${selectedUser.email}?`
          : `Grant admin privileges to ${selectedUser.email}?`;
      case 'delete':
        return `Are you sure you want to permanently delete ${selectedUser.email}? This action cannot be undone.`;
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-400">Manage user accounts and permissions</p>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary-400" />
            <span className="text-white font-medium">{users.length} Total Users</span>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search users by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
              <Button variant="ghost" size="sm" onClick={loadUsers}>
                Refresh
              </Button>
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">User</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Role</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Created</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Last Login</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-dark-800 hover:bg-dark-800/50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white font-medium">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.is_active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.is_admin
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {user.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {user.last_login 
                        ? new Date(user.last_login).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openActionModal(user, user.is_active ? 'deactivate' : 'activate')}
                          className={user.is_active ? 'text-orange-400 hover:text-orange-300' : 'text-green-400 hover:text-green-300'}
                        >
                          {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openActionModal(user, 'admin')}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          {user.is_admin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openActionModal(user, 'delete')}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No users found matching your criteria</p>
            </div>
          )}
        </Card>

        {/* Action Modal */}
        <Modal
          isOpen={!!selectedUser && !!actionType}
          onClose={closeModal}
          title={getActionTitle()}
          footer={
            <>
              <Button variant="ghost" onClick={closeModal} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                variant={actionType === 'delete' ? 'danger' : 'primary'}
                onClick={handleUserAction}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Confirm
              </Button>
            </>
          }
        >
          <p className="text-gray-300">{getActionMessage()}</p>
        </Modal>
      </div>
    </MainLayout>
  );
};