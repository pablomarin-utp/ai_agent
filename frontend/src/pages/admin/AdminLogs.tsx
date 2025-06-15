import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Filter, Download, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  event: string;
  message: string;
  user_id?: string;
  ip_address?: string;
  details?: string;
}

export const AdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');
  const [eventFilter, setEventFilter] = useState('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockLogs: LogEntry[] = Array.from({ length: 50 }, (_, i) => {
        const events = ['login_success', 'login_failed', 'user_registered', 'chat_message', 'rate_limit_exceeded', 'system_error'];
        const levels: LogEntry['level'][] = ['info', 'warning', 'error', 'success'];
        const event = events[Math.floor(Math.random() * events.length)];
        
        return {
          id: `log-${i + 1}`,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          level: levels[Math.floor(Math.random() * levels.length)],
          event,
          message: `${event.replace('_', ' ')} - Sample log entry ${i + 1}`,
          user_id: Math.random() > 0.3 ? `user-${Math.floor(Math.random() * 100)}` : undefined,
          ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
          details: Math.random() > 0.5 ? `Additional details for log entry ${i + 1}` : undefined,
        };
      });

      setLogs(mockLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.event.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesEvent = eventFilter === 'all' || log.event === eventFilter;
    
    return matchesSearch && matchesLevel && matchesEvent;
  });

  const uniqueEvents = [...new Set(logs.map(log => log.event))];

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'info':
        return 'bg-blue-500/20 text-blue-400';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'error':
        return 'bg-red-500/20 text-red-400';
      case 'success':
        return 'bg-green-500/20 text-green-400';
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Event', 'Message', 'User ID', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.level,
        log.event,
        log.message,
        log.user_id || '',
        log.ip_address || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
            <h1 className="text-3xl font-bold text-white mb-2">System Logs</h1>
            <p className="text-gray-400">Monitor system events and troubleshoot issues</p>
          </div>
          <Button onClick={exportLogs} variant="ghost">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as typeof levelFilter)}
              className="bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
            </select>

            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Events</option>
              {uniqueEvents.map(event => (
                <option key={event} value={event}>
                  {event.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>

            <Button variant="ghost" onClick={loadLogs}>
              Refresh
            </Button>
          </div>
        </Card>

        {/* Logs Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Level</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Timestamp</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Event</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Message</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">User ID</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-dark-800 hover:bg-dark-800/50"
                  >
                    <td className="py-4 px-4">
                      <span className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs ${getLevelColor(log.level)}`}>
                        {getLevelIcon(log.level)}
                        <span>{log.level.toUpperCase()}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-white font-medium">
                      {log.event.replace(/_/g, ' ').toUpperCase()}
                    </td>
                    <td className="py-4 px-4 text-gray-300 max-w-xs truncate">
                      {log.message}
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {log.user_id || '-'}
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {log.ip_address || '-'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No logs found matching your criteria</p>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};