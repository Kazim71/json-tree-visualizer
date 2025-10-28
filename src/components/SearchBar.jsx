import { useState, useEffect } from 'react';
import { Search, X, Zap, Target, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ onSearch, searchResults, totalNodes }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (value) => {
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  // Keyboard shortcut for search focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-strong rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: query ? 360 : 0 }}
          transition={{ duration: 0.5 }}
          className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg"
        >
          <Search className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-white text-lg">Smart Search</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Command className="w-3 h-3" />F to focus • Search paths & values
          </p>
        </div>
      </div>
      
      <div className="relative group">
        <motion.div
          animate={{
            boxShadow: isFocused 
              ? '0 0 0 3px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.2)'
              : '0 0 0 0px rgba(59, 130, 246, 0), 0 0 0px rgba(59, 130, 246, 0)'
          }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="$.user.address.city, posts[0].title..."
            className="w-full pl-12 pr-12 py-4 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 backdrop-blur-sm"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {query && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 border border-gray-200/50 dark:border-gray-600/50">
              {searchResults.length > 0 ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Target className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                    {searchResults.length} match{searchResults.length !== 1 ? 'es' : ''} found
                  </span>
                  <div className="ml-auto flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Zap className="w-3 h-3" />
                    <span>Auto-centered</span>
                  </div>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </motion.div>
                  <span className="text-red-600 dark:text-red-400 font-semibold text-sm">
                    No matches found
                  </span>
                  <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    Try different keywords
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;