import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface ConfigSection {
  id: string;
  title: string;
  description: string;
  settings: ConfigSetting[];
}

interface ConfigSetting {
  key: string;
  label: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  value: any;
  options?: { label: string; value: any }[];
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
  };
}

export const AdminConfig: React.FC = () => {
  const [configSections, setConfigSections] = useState<ConfigSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalConfig, setOriginalConfig] = useState<ConfigSection[]>([]);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockConfig: ConfigSection[] = [
        {
          id: 'general',
          title: 'General Settings',
          description: 'Basic application configuration',
          settings: [
            {
              key: 'app_name',
              label: 'Application Name',
              description: 'The name displayed in the application',
              type: 'string',
              value: 'AI Assistant',
              validation: { required: true }
            },
            {
              key: 'max_users',
              label: 'Maximum Users',
              description: 'Maximum number of registered users',
              type: 'number',
              value: 1000,
              validation: { min: 1, max: 10000 }
            },
            {
              key: 'maintenance_mode',
              label: 'Maintenance Mode',
              description: 'Enable maintenance mode to prevent user access',
              type: 'boolean',
              value: false
            }
          ]
        },
        {
          id: 'credits',
          title: 'Credit System',
          description: 'Configure the credit system and limits',
          settings: [
            {
              key: 'default_credits',
              label: 'Default Credits',
              description: 'Credits given to new users',
              type: 'number',
              value: 100,
              validation: { min: 0, max: 1000 }
            },
            {
              key: 'credit_refill_interval',
              label: 'Credit Refill Interval',
              description: 'How often credits are refilled (hours)',
              type: 'number',
              value: 24,
              validation: { min: 1, max: 168 }
            },
            {
              key: 'max_credits',
              label: 'Maximum Credits',
              description: 'Maximum credits a user can have',
              type: 'number',
              value: 500,
              validation: { min: 1, max: 10000 }
            }
          ]
        },
        {
          id: 'security',
          title: 'Security Settings',
          description: 'Authentication and security configuration',
          settings: [
            {
              key: 'jwt_expiry',
              label: 'JWT Token Expiry',
              description: 'JWT token expiration time',
              type: 'select',
              value: '24h',
              options: [
                { label: '1 Hour', value: '1h' },
                { label: '6 Hours', value: '6h' },
                { label: '24 Hours', value: '24h' },
                { label: '7 Days', value: '7d' },
                { label: '30 Days', value: '30d' }
              ]
            },
            {
              key: 'rate_limit_requests',
              label: 'Rate Limit (Requests)',
              description: 'Maximum requests per minute per user',
              type: 'number',
              value: 60,
              validation: { min: 1, max: 1000 }
            },
            {
              key: 'require_email_verification',
              label: 'Require Email Verification',
              description: 'Require users to verify their email before activation',
              type: 'boolean',
              value: false
            }
          ]
        },
        {
          id: 'ai',
          title: 'AI Configuration',
          description: 'AI model and processing settings',
          settings: [
            {
              key: 'ai_model',
              label: 'AI Model',
              description: 'The AI model to use for responses',
              type: 'select',
              value: 'gpt-3.5-turbo',
              options: [
                { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
                { label: 'GPT-4', value: 'gpt-4' },
                { label: 'Claude 3', value: 'claude-3' },
                { label: 'Llama 2', value: 'llama-2' }
              ]
            },
            {
              key: 'max_tokens',
              label: 'Maximum Tokens',
              description: 'Maximum tokens per AI response',
              type: 'number',
              value: 2048,
              validation: { min: 100, max: 8192 }
            },
            {
              key: 'temperature',
              label: 'AI Temperature',
              description: 'Controls randomness in AI responses (0.0 - 2.0)',
              type: 'number',
              value: 0.7,
              validation: { min: 0, max: 2 }
            }
          ]
        }
      ];

      setConfigSections(mockConfig);
      setOriginalConfig(JSON.parse(JSON.stringify(mockConfig)));
    } catch (error) {
      toast.error('Failed to load configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (sectionId: string, settingKey: string, value: any) => {
    setConfigSections(prev => 
      prev.map(section => 
        section.id === sectionId
          ? {
              ...section,
              settings: section.settings.map(setting =>
                setting.key === settingKey
                  ? { ...setting, value }
                  : setting
              )
            }
          : section
      )
    );
    setHasChanges(true);
  };

  const validateConfig = () => {
    for (const section of configSections) {
      for (const setting of section.settings) {
        if (setting.validation?.required && !setting.value) {
          toast.error(`${setting.label} is required`);
          return false;
        }
        if (setting.type === 'number' && setting.validation) {
          const numValue = Number(setting.value);
          if (setting.validation.min !== undefined && numValue < setting.validation.min) {
            toast.error(`${setting.label} must be at least ${setting.validation.min}`);
            return false;
          }
          if (setting.validation.max !== undefined && numValue > setting.validation.max) {
            toast.error(`${setting.label} must be at most ${setting.validation.max}`);
            return false;
          }
        }
      }
    }
    return true;
  };

  const saveConfig = async () => {
    if (!validateConfig()) return;

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setOriginalConfig(JSON.parse(JSON.stringify(configSections)));
      setHasChanges(false);
      toast.success('Configuration saved successfully');
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const resetConfig = () => {
    setConfigSections(JSON.parse(JSON.stringify(originalConfig)));
    setHasChanges(false);
    toast.success('Configuration reset to last saved state');
  };

  const renderSetting = (sectionId: string, setting: ConfigSetting) => {
    switch (setting.type) {
      case 'string':
        return (
          <Input
            value={setting.value}
            onChange={(e) => updateSetting(sectionId, setting.key, e.target.value)}
            placeholder={setting.label}
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={setting.value}
            onChange={(e) => updateSetting(sectionId, setting.key, parseFloat(e.target.value))}
            min={setting.validation?.min}
            max={setting.validation?.max}
            step={setting.key === 'temperature' ? 0.1 : 1}
          />
        );
      
      case 'boolean':
        return (
          <label className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={setting.value}
                onChange={(e) => updateSetting(sectionId, setting.key, e.target.checked)}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                setting.value ? 'bg-primary-600' : 'bg-dark-600'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  setting.value ? 'translate-x-5' : 'translate-x-0.5'
                } mt-0.5`} />
              </div>
            </div>
            <span className="text-gray-300">{setting.value ? 'Enabled' : 'Disabled'}</span>
          </label>
        );
      
      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => updateSetting(sectionId, setting.key, e.target.value)}
            className="w-full bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {setting.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return null;
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">System Configuration</h1>
            <p className="text-gray-400">Manage application settings and parameters</p>
          </div>
          <div className="flex items-center space-x-3">
            {hasChanges && (
              <div className="flex items-center space-x-2 text-orange-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Unsaved changes</span>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={resetConfig}
              disabled={!hasChanges || isSaving}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={saveConfig}
              isLoading={isSaving}
              disabled={!hasChanges || isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {configSections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <Card>
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <Settings className="w-5 h-5 text-primary-400" />
                    <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                  </div>
                  <p className="text-gray-400">{section.description}</p>
                </div>

                <div className="space-y-6">
                  {section.settings.map((setting, settingIndex) => (
                    <motion.div
                      key={setting.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (settingIndex * 0.05) }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start"
                    >
                      <div>
                        <h3 className="text-white font-medium mb-1">{setting.label}</h3>
                        <p className="text-sm text-gray-400">{setting.description}</p>
                        {setting.validation?.required && (
                          
                          <span className="text-xs text-red-400">* Required</span>
                        )}
                      </div>
                      <div>
                        {renderSetting(section.id, setting)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};