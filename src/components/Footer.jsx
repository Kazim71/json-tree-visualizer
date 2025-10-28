import { motion } from 'framer-motion';
import { Code, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="glass-strong border-t border-white/10 dark:border-gray-700/30 mt-16"
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 dark:text-white">About</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              A modern, interactive JSON tree visualizer built with React, Tailwind CSS, and Framer Motion. 
              Transform your JSON data into beautiful, explorable tree structures.
            </p>
          </div>
          
          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 dark:text-white">Features</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-blue-500" />
                <span>Real-time JSON parsing</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-emerald-500" />
                <span>Interactive tree navigation</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-purple-500" />
                <span>Advanced search & filtering</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-pink-500" />
                <span>Export to PNG images</span>
              </li>
            </ul>
          </div>
          
          {/* Quick Tips */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 dark:text-white">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>💡 Click nodes to copy JSON paths</li>
              <li>🔍 Use ⌘F to quickly search</li>
              <li>🎨 Switch themes with the toggle</li>
              <li>📱 Fully responsive design</li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Built with React and Tailwind CSS</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span>Open Source</span>
              </div>
              <span>•</span>
              <span>© 2025 JSON Tree Visualizer</span>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;