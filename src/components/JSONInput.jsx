import { useState } from 'react';
import { FileText, Play, Trash2, Loader2, Sparkles, Code, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const SAMPLE_TEMPLATES = [
  {
    name: 'User Profile',
    icon: '👤',
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
    icon: '🛒',
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
    icon: '🌐',
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
  }
];

const JSONInput = ({ onVisualize, onClear, error, isLoading }) => {
  const [input, setInput] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

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
    toast.success('Input cleared!', { icon: '🗑️' });
  };

  const loadTemplate = (template) => {
    const jsonString = JSON.stringify(template.data, null, 2);
    setInput(jsonString);
    setShowTemplates(false);
    toast.success(`${template.name} template loaded!`, { icon: template.icon });
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
      className="glass-card space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="p-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl shadow-lg"
          >
            <FileText className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">JSON Input</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Paste or type your JSON data</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTemplates(!showTemplates)}
          className="btn-secondary text-sm py-2 px-4"
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl border border-blue-200/50 dark:border-gray-600/50">
              {SAMPLE_TEMPLATES.map((template, index) => (
                <motion.button
                  key={template.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => loadTemplate(template)}
                  className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-white/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200 text-left group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{template.icon}</span>
                    <span className="font-semibold text-sm text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {template.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Click to load sample
                  </p>
                </motion.button>
              ))}
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
          className={`w-full h-80 p-4 font-mono text-sm resize-none rounded-xl border-2 transition-all duration-300 focus-ring backdrop-blur-sm ${
            error 
              ? 'border-red-300 bg-red-50/50 dark:bg-red-900/20 dark:border-red-600' 
              : 'border-gray-200/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50'
          } text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
          whileFocus={{ scale: 1.01 }}
        />
        
        {/* Character count */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded backdrop-blur-sm">
          {input.length} chars
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
            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="p-1 bg-red-100 dark:bg-red-900/30 rounded-full"
                >
                  <Code className="w-4 h-4 text-red-600 dark:text-red-400" />
                </motion.div>
                <div>
                  <p className="font-semibold text-red-800 dark:text-red-200 text-sm mb-1">
                    Invalid JSON Format
                  </p>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleVisualize}
          disabled={isLoading}
          className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <span>Generate Tree</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClear}
          disabled={isLoading}
          className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </motion.button>
      </div>

      {/* Quick Tips */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
        <div className="flex items-start gap-3">
          <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-200 text-sm mb-1">
              Pro Tips
            </p>
            <ul className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
              <li>• Use templates for quick start</li>
              <li>• Supports nested objects and arrays</li>
              <li>• Leave empty to use default sample</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JSONInput;