import { motion } from 'framer-motion';
import { Database, ArrowRight } from 'lucide-react';

const EmptyState = ({ onLoadSample }) => {
  const features = [
    {
      title: 'Interactive Trees',
      description: 'Navigate through nested JSON structures'
    },
    {
      title: 'Smart Search',
      description: 'Find any key or value instantly'
    },
    {
      title: 'Responsive Design',
      description: 'Works perfectly on all devices'
    },
    {
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
      <div className="max-w-2xl p-8 mx-auto space-y-8 text-center">
        {/* Main Icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex items-center justify-center w-24 h-24 mx-auto shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl"
        >
          <Database className="w-12 h-12 text-white" />
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
            className="max-w-md mx-auto text-lg leading-relaxed text-gray-600 dark:text-gray-400"
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLoadSample}
          className="flex items-center gap-2 px-6 py-3 mx-auto text-base btn-primary"
        >
          <span>Load Sample Data</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4 mt-12 md:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="p-4 text-center border bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border-gray-200/50 dark:border-gray-700/30"
            >
              <h3 className="mb-1 text-sm font-medium text-gray-800 dark:text-white">
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
          className="flex items-center justify-center gap-6 pt-8 text-sm text-gray-500 border-t dark:text-gray-400 border-gray-200/50 dark:border-gray-700/50"
        >
          <span>Supports all JSON types</span>
          <span>•</span>
          <span>Quick search</span>
          <span>•</span>
          <span>Export as image</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmptyState;