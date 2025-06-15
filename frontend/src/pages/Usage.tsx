import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, MessageSquare, Coins, Activity } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

interface UsageData {
  date: string;
  messages: number;
  credits: number;
}

interface InteractionRecord {
  id: string;
  timestamp: string;
  prompt: string;
  status: 'success' | 'error';
  credits_used: number;
}

export const Usage: React.FC = () => {
  const { credits } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [interactions, setInteractions] = useState<InteractionRecord[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadUsageData();
  }, [timeRange]);

  const loadUsageData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockUsageData: UsageData[] = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        messages: Math.floor(Math.random() * 20),
        credits: Math.floor(Math.random() * 50),
      }));

      const mockInteractions: InteractionRecord[] = Array.from({ length: 20 }, (_, i) => ({
        id: i.toString(),
        timestamp: new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString(),
        prompt: `Sample query ${i + 1}...`,
        status: Math.random() > 0.1 ? 'success' : 'error',
        credits_used: Math.floor(Math.random() * 5) + 1,
      }));

      setUsageData(mockUsageData);
      setInteractions(mockInteractions);
    } catch (error) {
      console.error('Failed to load usage data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalMessages = usageData.reduce((sum, day) => sum + day.messages, 0);
  const totalCreditsUsed = usageData.reduce((sum, day) => sum + day.credits, 0);
  const successRate = interactions.length > 0 
    ? (interactions.filter(i => i.status === 'success').length / interactions.length) * 100 
    : 0;

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
            <h1 className="text-3xl font-bold text-white mb-2">Usage Analytics</h1>
            <p className="text-gray-400">Track your AI assistant usage and credits</p>
          </div>
          <div className="flex space-x-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card hover>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{totalMessages.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Total Messages</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card hover>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                  <Coins className="w-6 h-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{credits}</p>
                  <p className="text-sm text-gray-400">Credits Remaining</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card hover>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{totalCreditsUsed}</p>
                  <p className="text-sm text-gray-400">Credits Used</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card hover>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{successRate.toFixed(1)}%</p>
                  <p className="text-sm text-gray-400">Success Rate</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Messages Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Daily Messages</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(date) => new Date(date).getDate().toString()}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Bar dataKey="messages" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Credits Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Credit Usage</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(date) => new Date(date).getDate().toString()}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="credits" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Recent Interactions */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Interactions</h3>
            <Button variant="ghost" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Query</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Credits</th>
                </tr>
              </thead>
              <tbody>
                {interactions.slice(0, 10).map((interaction, index) => (
                  <motion.tr
                    key={interaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-dark-800 hover:bg-dark-800/50"
                  >
                    <td className="py-3 px-4 text-gray-300">
                      {new Date(interaction.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-white max-w-xs truncate">
                      {interaction.prompt}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        interaction.status === 'success'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {interaction.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {interaction.credits_used}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};