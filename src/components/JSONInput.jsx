import { useState, useRef } from 'react';
import { FileText, Play, Trash2, Loader2, Sparkles, Code, Zap, Upload, User, ShoppingCart, Globe, Settings, Smartphone, TrendingUp, Radio, DollarSign, RotateCcw, Undo2, Redo2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const SAMPLE_TEMPLATES = [
  {
    name: 'User Profile',
    icon: <User className="w-4 h-4" />,
    description: 'Complete user profile with personal info and preferences',
    data: {
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "zipcode": "10001"
        },
        "hobbies": ["reading", "coding", "gaming"]
      }
    }
  },
  {
    name: 'E-commerce',
    icon: <ShoppingCart className="w-4 h-4" />,
    description: 'Product catalog with orders and inventory data',
    data: {
      "products": [
        {
          "id": 1,
          "name": "Laptop",
          "price": 999.99,
          "category": "Electronics",
          "inStock": true,
          "specs": {
            "cpu": "Intel i7",
            "ram": "16GB",
            "storage": "512GB SSD"
          }
        }
      ],
      "order": {
        "id": "ORD-001",
        "total": 999.99,
        "status": "shipped"
      }
    }
  },
  {
    name: 'API Response',
    icon: <Globe className="w-4 h-4" />,
    description: 'REST API response with pagination and metadata',
    data: {
      "status": "success",
      "data": {
        "posts": [
          {
            "id": 1,
            "title": "Hello World",
            "published": true,
            "tags": ["tech", "programming"]
          }
        ]
      },
      "meta": {
        "total": 1,
        "page": 1
      }
    }
  },
  {
    name: 'Config File',
    icon: <Settings className="w-4 h-4" />,
    description: 'Application configuration with database and API settings',
    data: {
      "app": {
        "name": "MyApp",
        "version": "1.0.0",
        "environment": "production"
      },
      "database": {
        "host": "localhost",
        "port": 5432,
        "name": "myapp_db",
        "ssl": true
      },
      "features": {
        "auth": true,
        "analytics": false,
        "notifications": true
      }
    }
  },
  {
    name: 'Social Media',
    icon: <Smartphone className="w-4 h-4" />,
    description: 'Social media post with comments and engagement metrics',
    data: {
      "post": {
        "id": "post_123",
        "author": {
          "username": "johndoe",
          "verified": true,
          "followers": 1250
        },
        "content": "Just launched my new project!",
        "timestamp": "2024-01-15T10:30:00Z",
        "engagement": {
          "likes": 42,
          "shares": 8,
          "comments": 15
        }
      }
    }
  },
  {
    name: 'Analytics',
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Website analytics data with metrics and time series',
    data: {
      "analytics": {
        "period": "last_30_days",
        "metrics": {
          "pageviews": 15420,
          "unique_visitors": 8930,
          "bounce_rate": 0.34
        },
        "top_pages": [
          {
            "path": "/home",
            "views": 5420,
            "conversion_rate": 0.12
          }
        ],
        "traffic_sources": {
          "organic": 45.2,
          "direct": 32.1,
          "social": 12.7
        }
      }
    }
  },
  {
    name: 'IoT Device',
    icon: <Radio className="w-4 h-4" />,
    description: 'IoT sensor data with readings and device status',
    data: {
      "device": {
        "id": "sensor_001",
        "type": "temperature_humidity",
        "location": {
          "room": "living_room",
          "coordinates": {
            "lat": 40.7128,
            "lng": -74.0060
          }
        },
        "status": {
          "online": true,
          "battery": 87,
          "last_update": "2024-01-15T14:30:00Z"
        },
        "readings": [
          {
            "timestamp": "2024-01-15T14:30:00Z",
            "temperature": 22.5,
            "humidity": 45.2
          }
        ]
      }
    }
  },
  {
    name: 'Financial',
    icon: <DollarSign className="w-4 h-4" />,
    description: 'Financial transaction data with account details',
    data: {
      "account": {
        "id": "acc_12345",
        "holder": "John Doe",
        "type": "checking",
        "balance": 2450.75,
        "currency": "USD"
      },
      "transactions": [
        {
          "id": "txn_001",
          "date": "2024-01-15",
          "amount": -45.99,
          "description": "Coffee Shop",
          "category": "food"
        },
        {
          "id": "txn_002",
          "date": "2024-01-14",
          "amount": 2500.00,
          "description": "Salary Deposit",
          "category": "income"
        }
      ]
    }
  }
];

const JSONInput = ({ onVisualize, onClear, onReset, onUndo, onRedo, error, isLoading, canUndo, canRedo, canReset }) => {
  const [input, setInput] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const fileInputRef = useRef(null);

  const handleVisualize = () => {
    let jsonToUse;
    if (input.trim()) {
      jsonToUse = input.trim();
    } else {
      // Use sample data if input is empty
      jsonToUse = JSON.stringify(SAMPLE_TEMPLATES[0].data, null, 2);
    }
    onVisualize(jsonToUse);
  };

  const handleClear = () => {
    setInput('');
    onClear();
    toast.success('Input cleared!');
  };

  const handleReset = () => {
    onReset();
    toast.success('Reset to first version!');
  };

  const handleUndo = () => {
    onUndo();
    toast.success('Undone!');
  };

  const handleRedo = () => {
    onRedo();
    toast.success('Redone!');
  };

  const loadTemplate = (template) => {
    const jsonString = JSON.stringify(template.data, null, 2);
    setInput(jsonString);
    setShowTemplates(false);
    toast.success(`${template.name} template loaded!`);
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = e.target.result;
          setInput(jsonData);
          toast.success('JSON file imported successfully!');
        } catch (error) {
          toast.error('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    } else {
      toast.error('Please select a valid JSON file');
    }
    event.target.value = '';
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Clear error when user starts typing
    if (error && e.target.value.trim()) {
      // This will be handled by parent component
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 glass-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
\\
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">JSON Input</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Paste or type your JSON data</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTemplates(!showTemplates)}
          className="px-4 py-2 text-sm btn-secondary"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Templates
        </motion.button>
      </div>

      {/* Templates Panel */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl border-blue-200/50 dark:border-gray-600/50">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {SAMPLE_TEMPLATES.map((template, index) => (
                  <motion.div
                    key={template.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => loadTemplate(template)}
                      className="w-full min-w-0 p-3 overflow-hidden text-left transition-all duration-200 border rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/50 dark:border-gray-700/50 hover:shadow-lg"
                    >
                      <div className="flex items-center min-w-0 gap-2 mb-2">
                        <div className="flex-shrink-0 text-blue-600 dark:text-blue-400">{template.icon}</div>
                        <span className="text-sm font-semibold text-gray-800 truncate dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {template.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 break-words dark:text-gray-400">
                        Click to load sample
                      </p>
                    </motion.button>
                    
                    {/* Responsive Hover Tooltip */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 0, scale: 0.95, y: 10 }}
                      whileHover={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute z-50 px-3 py-2 text-xs text-white transition-all duration-200 bg-gray-900 rounded-lg shadow-xl pointer-events-none opacity-0 dark:bg-gray-800 group-hover:opacity-100 group-hover:pointer-events-auto
                        bottom-full left-1/2 transform -translate-x-1/2 mb-2 max-w-xs w-max
                        sm:left-0 sm:transform-none sm:translate-x-0
                        lg:left-1/2 lg:transform lg:-translate-x-1/2
                        before:content-[''] before:absolute before:top-full before:left-1/2 before:transform before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-900 before:dark:border-t-gray-800
                        sm:before:left-4 sm:before:transform-none sm:before:translate-x-0
                        lg:before:left-1/2 lg:before:transform lg:before:-translate-x-1/2"
                    >
                      <div className="font-semibold text-white">{template.name}</div>
                      <div className="mt-1 text-gray-300 break-words whitespace-normal dark:text-gray-400">{template.description}</div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* JSON Textarea */}
      <div className="relative">
        <motion.textarea
          value={input}
          onChange={handleInputChange}
          placeholder={JSON.stringify(SAMPLE_TEMPLATES[0].data, null, 2)}
          maxLength={8000}
          className={`w-full h-80 p-4 font-mono text-sm resize-none rounded-xl border-2 transition-all duration-300 focus-ring backdrop-blur-sm ${
            error 
              ? 'border-red-300 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
              : 'border-gray-200/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50'
          } text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
          whileFocus={{ scale: 1.01 }}
        />
        
        {/* Character count */}
        <div className="absolute px-2 py-1 text-xs text-gray-400 rounded bottom-2 right-2 dark:text-gray-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          {input.length}/8000 chars
        </div>
      </div>
      
      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-800 rounded-xl">
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="p-1 bg-red-100 rounded-full dark:bg-red-900/30"
                >
                  <Code className="w-4 h-4 text-red-600 dark:text-red-400" />
                </motion.div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-red-800 dark:text-red-200">
                    Invalid JSON Format
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Primary Actions */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVisualize}
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, rotate: { duration: 1, repeat: Infinity, ease: "linear" } }}
                >
                  <Loader2 className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  <span className="hidden xs:inline sm:hidden md:inline">Generate Tree</span>
                  <span className="xs:hidden sm:inline md:hidden">Generate</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClear}
            disabled={isLoading}
            className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </motion.button>
        </div>

        {/* History Controls */}
        <div className="grid grid-cols-3 gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUndo}
            disabled={!canUndo || isLoading}
            className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed min-h-[40px] text-sm"
          >
            <Undo2 className="w-4 h-4" />
            <span>Undo</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            disabled={!canReset || isLoading}
            className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed min-h-[40px] text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRedo}
            disabled={!canRedo || isLoading}
            className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed min-h-[40px] text-sm"
          >
            <Redo2 className="w-4 h-4" />
            <span>Redo</span>
          </motion.button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        className="hidden"
      />

      {/* Quick Tips */}
      <div className="p-4 border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-blue-200/50 dark:border-blue-800/50">
        <div className="flex items-start gap-3">
          <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="mb-1 text-sm font-semibold text-blue-800 dark:text-blue-200">
              Pro Tips
            </p>
            <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
              <li>Use templates for quick start</li>
              <li>Supports nested objects and arrays</li>
              <li>Leave empty to use default sample</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JSONInput;