import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Trash2, Copy } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useRateLimitHandling } from '../hooks/useRateLimitHandling';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, credits, updateCredits } = useAuth();
  const { rateLimitState, handleRateLimit } = useRateLimitHandling();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading || rateLimitState.isBlocked) return;
    
    if (credits <= 0) {
      toast.error('No credits remaining. Please upgrade your plan or wait for credit refill.');
      return;
    }
    if (!user?.is_active) {
      toast.error('Your account is not active. Please contact support.');
      return;
    }
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chat_message = await apiService.sendChatMessage(user.id, userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: chat_message.response,
        timestamp: new Date(),
      };



      setMessages(prev => [...prev, assistantMessage]);
      updateCredits(credits - 1); // Deduct one credit
      
    } catch (error: any) {
      if (error.response?.status === 429) {
        const retryAfter = parseInt(error.response.headers['retry-after']) || 60;
        handleRateLimit(retryAfter);
      } else {
        toast.error('Failed to get response. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    toast.success('Conversation cleared');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <MainLayout>
      <div className="h-full flex flex-col max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
            <p className="text-gray-400">Ask me anything, I'm here to help</p>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              onClick={clearConversation}
              className="text-gray-400 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Rate Limit Banner */}
        {rateLimitState.isBlocked && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-orange-500/20 border border-orange-500/30 rounded-xl"
          >
            <p className="text-orange-400 text-center">
              Rate limit exceeded. Please wait {rateLimitState.remainingTime} seconds before sending another message.
            </p>
          </motion.div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4 mb-6">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-effect">
                    <Bot className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Ready to assist</h3>
                  <p className="text-gray-400">Start a conversation by typing your question below</p>
                </div>
              </motion.div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-primary-600' 
                        : 'bg-gradient-to-br from-primary-500 to-primary-700'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`glass-effect rounded-2xl p-4 ${
                      message.role === 'user' 
                        ? 'border-primary-500/30' 
                        : 'border-dark-600'
                    }`}>
                      <p className="text-white whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-400">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(message.content)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="glass-effect rounded-2xl p-4 border-dark-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="glass-effect rounded-2xl p-4 border border-dark-700">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <div className="flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  credits <= 0 
                    ? "No credits remaining..." 
                    : rateLimitState.isBlocked 
                    ? "Rate limited, please wait..." 
                    : "Type your message..."
                }
                disabled={isLoading || credits <= 0 || rateLimitState.isBlocked}
                className="border-0 bg-transparent focus:ring-0"
              />
            </div>
            <Button
              type="submit"
              disabled={!input.trim() || isLoading || credits <= 0 || rateLimitState.isBlocked}
              className="px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          
          {credits <= 5 && credits > 0 && (
            <p className="text-sm text-orange-400 mt-2">
              Warning: You have {credits} credits remaining
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};