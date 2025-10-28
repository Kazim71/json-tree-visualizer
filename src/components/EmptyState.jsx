import { motion } from 'framer-motion';
import { Database, Sparkles, Zap, ArrowRight } from 'lucide-react';

const EmptyState = ({ onLoadSample }) => {
  const features = [
    {
      icon: '🌳',
      title: 'Interactive Trees',
      description: 'Navigate through nested JSON structures'
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Find any key or value instantly'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Works perfectly on all devices'
    },
    {
      icon: '🎨',
      title: 'Beautiful Visuals',
      description: 'Color-coded nodes and smooth animations'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card min-h-[600px] flex items-center justify-center"
    >
      <div className="text-center space-y-8 max-w-2xl mx-auto p-8">
        {/* Main Icon */}
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden"
        >
          <Database className="w-16 h-16 text-white z-10" />
          
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Title and Description */}
        <div className="space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gradient"
          >
            Ready to Visualize JSON
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto leading-relaxed"
          >
            Transform your JSON data into beautiful, interactive tree structures. 
            Explore nested objects and arrays with ease.
          </motion.p>
        </div>

        {/* Quick Start Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLoadSample}
          className="btn-primary text-lg px-8 py-4 mx-auto flex items-center gap-3 group"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>Try Sample Data</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/30 text-center group hover:shadow-lg transition-all duration-300"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tips */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 pt-8 border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Supports all JSON types</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⌘F</span>
            <span>Quick search</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📸</span>
            <span>Export as image</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmptyState;