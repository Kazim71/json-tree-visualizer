import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database, Github, Info, Sun, Moon, Menu as MenuIcon, X
} from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b glass-strong border-white/10 dark:border-gray-700/30"
      >
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-2 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"
              >
                <Database className="w-6 h-6 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gradient">JSON Tree Visualizer</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Interactive JSON Explorer</p>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 transition-all duration-200 rounded-lg dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <AnimatePresence mode="wait">
                  {darkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Moon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* About */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAboutModal(true)}
                className="p-2 text-gray-600 transition-all duration-200 rounded-lg dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50"
                title="About"
              >
                <Info className="w-5 h-5" />
              </motion.button>

              {/* GitHub */}
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/Kazim71/json-tree-visualizer"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 transition-all duration-200 rounded-lg dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50"
                title="View on GitHub"
              >
                <Github className="w-5 h-5" />
              </motion.a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 transition-all duration-200 rounded-lg sm:hidden dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="py-4 border-t sm:hidden border-white/10 dark:border-gray-700/30"
              >
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => {
                      setShowAboutModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 text-left text-gray-600 transition-all duration-200 rounded-lg dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50"
                  >
                    <Info className="w-5 h-5" />
                    <span>About</span>
                  </button>
                  <a
                    href="https://github.com/Kazim71/json-tree-visualizer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 text-gray-600 transition-all duration-200 rounded-lg dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50"
                  >
                    <Github className="w-5 h-5" />
                    <span>GitHub</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* About Modal */}
      <AnimatePresence>
        {showAboutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAboutModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 border shadow-2xl glass-strong rounded-2xl border-white/20 dark:border-gray-700/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">About JSON Tree Visualizer</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>A modern, interactive JSON tree visualizer built with React, Tailwind CSS, and Framer Motion.</p>
                <p>Transform your JSON data into beautiful, explorable tree structures with advanced search capabilities.</p>
                <div className="pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                  <p className="mb-2 font-semibold text-gray-800 dark:text-white">Features:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Real-time JSON parsing and validation</li>
                    <li>• Interactive tree navigation with search</li>
                    <li>• Export to PNG images</li>
                    <li>• Dark/Light theme support</li>
                    <li>• Responsive design for all devices</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="w-full mt-6 btn-primary"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;