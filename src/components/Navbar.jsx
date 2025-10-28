import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from '@headlessui/react';
import {
  Database, Github, Info, Search, Edit3, Download, Upload, Copy,
  ZoomIn, ZoomOut, RotateCcw, Undo2, Redo2, HelpCircle, Settings,
  Sun, Moon, Palette, Menu as MenuIcon, X, ChevronDown, File,
  Eye, Keyboard, User
} from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = ({ 
  darkMode, 
  toggleDarkMode, 
  isEditMode, 
  toggleEditMode, 
  onSearch, 
  searchResults = [], 
  onExport, 
  onImport, 
  onZoomIn, 
  onZoomOut, 
  onReset, 
  onUndo, 
  onRedo,
  canUndo = false,
  canRedo = false
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  const themes = [
    { name: 'Light', value: 'light', icon: Sun },
    { name: 'Dark', value: 'dark', icon: Moon },
    { name: 'Auto', value: 'auto', icon: Palette }
  ];

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = e.target.result;
          onImport(jsonData);
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const shortcuts = [
    { key: '⌘/Ctrl + F', action: 'Search nodes' },
    { key: '⌘/Ctrl + E', action: 'Toggle edit mode' },
    { key: '⌘/Ctrl + S', action: 'Save/Export' },
    { key: '⌘/Ctrl + Z', action: 'Undo' },
    { key: '⌘/Ctrl + Y', action: 'Redo' },
    { key: '+/-', action: 'Zoom in/out' },
    { key: 'R', action: 'Reset view' },
    { key: 'Esc', action: 'Close modals' }
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey)) {
        switch (e.key) {
          case 'f':
            e.preventDefault();
            document.getElementById('navbar-search')?.focus();
            break;
          case 'e':
            e.preventDefault();
            toggleEditMode();
            break;
          case 's':
            e.preventDefault();
            onExport();
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              onRedo();
            } else {
              onUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            onRedo();
            break;
        }
      }
      if (e.key === 'Escape') {
        setShowAboutModal(false);
        setShowHelpModal(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleEditMode, onExport, onUndo, onRedo]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong border-b border-white/10 dark:border-gray-700/30 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg"
              >
                <Database className="w-6 h-6 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gradient">JSON Tree Visualizer</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Interactive JSON Explorer</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="navbar-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search nodes..."
                  className="pl-10 pr-4 py-2 w-64 bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {searchResults.length > 0 && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                    {searchResults.length}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* File Menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200">
                    <File className="w-5 h-5" />
                  </Menu.Button>
                  <AnimatePresence>
                    <Menu.Items className="absolute right-0 mt-2 w-48 glass-strong rounded-xl shadow-xl border border-white/20 dark:border-gray-700/30 py-2">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className={`${active ? 'bg-blue-50 dark:bg-blue-900/20' : ''} flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                          >
                            <Upload className="w-4 h-4" />
                            Import JSON
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={onExport}
                            className={`${active ? 'bg-blue-50 dark:bg-blue-900/20' : ''} flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                          >
                            <Download className="w-4 h-4" />
                            Export PNG
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </AnimatePresence>
                </Menu>

                {/* Edit Mode Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleEditMode}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isEditMode 
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50'
                  }`}
                  title="Toggle Edit Mode (⌘E)"
                >
                  <Edit3 className="w-5 h-5" />
                </motion.button>

                {/* View Controls */}
                <div className="flex items-center gap-1 border-l border-gray-200/50 dark:border-gray-600/50 pl-2">
                  <button
                    onClick={onZoomIn}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                    title="Zoom In (+)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onZoomOut}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                    title="Zoom Out (-)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onReset}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                    title="Reset View (R)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Undo/Redo */}
                <div className="flex items-center gap-1 border-l border-gray-200/50 dark:border-gray-600/50 pl-2">
                  <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      canUndo 
                        ? 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50' 
                        : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    }`}
                    title="Undo (⌘Z)"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onRedo}
                    disabled={!canRedo}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      canRedo 
                        ? 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50' 
                        : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    }`}
                    title="Redo (⌘Y)"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Selector */}
              <Menu as="div" className="relative">
                <Menu.Button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200">
                  {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-32 glass-strong rounded-xl shadow-xl border border-white/20 dark:border-gray-700/30 py-2">
                  {themes.map((theme) => (
                    <Menu.Item key={theme.value}>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            if (theme.value === 'dark') toggleDarkMode(true);
                            else if (theme.value === 'light') toggleDarkMode(false);
                            else toggleDarkMode(); // Auto mode
                          }}
                          className={`${active ? 'bg-blue-50 dark:bg-blue-900/20' : ''} flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                        >
                          <theme.icon className="w-4 h-4" />
                          {theme.name}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Menu>

              {/* Help */}
              <button
                onClick={() => setShowHelpModal(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                title="Keyboard Shortcuts"
              >
                <HelpCircle className="w-5 h-5" />
              </button>

              {/* About */}
              <button
                onClick={() => setShowAboutModal(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                title="About"
              >
                <Info className="w-5 h-5" />
              </button>

              {/* GitHub */}
              <a
                href="https://github.com/Kazim71/json-tree-visualizer"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                title="View on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200"
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
                className="lg:hidden border-t border-white/10 dark:border-gray-700/30 py-4"
              >
                {/* Mobile Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search nodes..."
                    className="pl-10 pr-4 py-2 w-full bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Mobile Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 p-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Import</span>
                  </button>
                  <button
                    onClick={onExport}
                    className="flex items-center gap-2 p-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Export</span>
                  </button>
                  <button
                    onClick={toggleEditMode}
                    className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
                      isEditMode 
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="text-sm">Edit Mode</span>
                  </button>
                  <button
                    onClick={onReset}
                    className="flex items-center gap-2 p-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-sm">Reset</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        className="hidden"
      />

      {/* About Modal */}
      <AnimatePresence>
        {showAboutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAboutModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/20 dark:border-gray-700/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">About JSON Tree Visualizer</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>A modern, interactive JSON tree visualizer built with React, Tailwind CSS, and Framer Motion.</p>
                <p>Transform your JSON data into beautiful, explorable tree structures with advanced editing capabilities.</p>
                <div className="pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                  <p className="font-semibold text-gray-800 dark:text-white mb-2">Features:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Real-time JSON parsing and validation</li>
                    <li>• Interactive tree navigation with search</li>
                    <li>• Edit mode with inline editing capabilities</li>
                    <li>• Export to PNG images</li>
                    <li>• Dark/Light theme support</li>
                    <li>• Keyboard shortcuts and accessibility</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="mt-6 w-full btn-primary"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowHelpModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/20 dark:border-gray-700/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl">
                  <Keyboard className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Keyboard Shortcuts</h3>
              </div>
              <div className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/30 dark:bg-gray-800/30">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{shortcut.action}</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="mt-6 w-full btn-primary"
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