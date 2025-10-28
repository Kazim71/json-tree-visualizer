import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="glass-strong border-t border-white/10 dark:border-gray-700/30 mt-16"
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center space-y-4">
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-2">JSON Tree Visualizer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
              A modern, interactive JSON tree visualizer built with React, Tailwind CSS, and Framer Motion. 
              Transform your JSON data into beautiful, explorable tree structures.
            </p>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 mt-6 pt-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Built with React and Tailwind CSS • Open Source • © 2025 JSON Tree Visualizer</p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;