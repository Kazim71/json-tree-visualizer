import { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Moon, Sun, Sparkles, Database, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import JSONInput from './components/JSONInput';
import SearchBar from './components/SearchBar';
import TreeVisualization from './components/TreeVisualization';
import EmptyState from './components/EmptyState';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { parseJSON, generateTreeNodes, searchInTree } from './utils/jsonParser';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) {
        return stored === 'true';
      }
    }
    return false; // Default to light mode
  });
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleVisualize = async (jsonInput) => {
    setIsLoading(true);
    
    // Add slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const result = parseJSON(jsonInput);
    
    if (result.success) {
      const { nodes: treeNodes, edges: treeEdges } = generateTreeNodes(result.data);
      
      // Save to history before updating
      const newState = { nodes: treeNodes, edges: treeEdges, jsonInput };
      setHistory(prev => [...prev.slice(0, currentHistoryIndex + 1), newState]);
      setCurrentHistoryIndex(prev => prev + 1);
      
      setNodes(treeNodes);
      setEdges(treeEdges);
      setError('');
      setSearchResults([]);
    } else {
      setError(result.error);
      setNodes([]);
      setEdges([]);
    }
    
    setIsLoading(false);
  };

  const handleClear = () => {
    setNodes([]);
    setEdges([]);
    setError('');
    setSearchResults([]);
    setHistory([]);
    setCurrentHistoryIndex(-1);
  };

  const handleReset = () => {
    if (history.length > 0) {
      const firstState = history[0];
      setNodes(firstState.nodes);
      setEdges(firstState.edges);
      setCurrentHistoryIndex(0);
      setError('');
      setSearchResults([]);
    }
  };

  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      const prevIndex = currentHistoryIndex - 1;
      const prevState = history[prevIndex];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setCurrentHistoryIndex(prevIndex);
      setError('');
      setSearchResults([]);
    }
  };

  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      const nextIndex = currentHistoryIndex + 1;
      const nextState = history[nextIndex];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setCurrentHistoryIndex(nextIndex);
      setError('');
      setSearchResults([]);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = searchInTree(nodes, query);
    setSearchResults(results);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const loadSampleData = () => {
    const sampleData = {
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
      },
      "posts": [
        {
          "id": 1,
          "title": "Hello World",
          "published": true,
          "tags": ["tech", "programming"]
        },
        {
          "id": 2,
          "title": "JSON Visualization",
          "published": false,
          "tags": ["data", "visualization"]
        }
      ]
    };
    handleVisualize(JSON.stringify(sampleData, null, 2));
  };

  const handleTreeUpdate = (updatedData) => {
    // Re-generate tree from updated JSON data
    if (updatedData) {
      const { nodes: treeNodes, edges: treeEdges } = generateTreeNodes(updatedData);
      
      // Save to history
      const newState = { nodes: treeNodes, edges: treeEdges, jsonInput: JSON.stringify(updatedData, null, 2) };
      setHistory(prev => [...prev.slice(0, currentHistoryIndex + 1), newState]);
      setCurrentHistoryIndex(prev => prev + 1);
      
      setNodes(treeNodes);
      setEdges(treeEdges);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark' : ''}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950" />
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
        />
        
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 max-w-7xl">

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Panel - JSON Input & Search */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="xl:col-span-4 space-y-6"
            >
              <JSONInput 
                onVisualize={handleVisualize}
                onClear={handleClear}
                onReset={handleReset}
                onUndo={handleUndo}
                onRedo={handleRedo}
                error={error}
                isLoading={isLoading}
                canUndo={currentHistoryIndex > 0}
                canRedo={currentHistoryIndex < history.length - 1}
                canReset={history.length > 0}
              />
              
              <AnimatePresence>
                {nodes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:hidden"
                  >
                    <SearchBar 
                      onSearch={handleSearch}
                      searchResults={searchResults}
                      totalNodes={nodes.length}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Right Panel - Tree Visualization */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="xl:col-span-8 space-y-6"
            >
              <AnimatePresence>
                {nodes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hidden lg:block"
                  >
                    <SearchBar 
                      onSearch={handleSearch}
                      searchResults={searchResults}
                      totalNodes={nodes.length}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence mode="wait">
                {nodes.length > 0 ? (
                  <motion.div
                    key="tree"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ReactFlowProvider>
                      <TreeVisualization 
                        nodes={nodes}
                        edges={edges}
                        searchResults={searchResults}
                        isLoading={isLoading}
                        onTreeUpdate={handleTreeUpdate}
                      />
                    </ReactFlowProvider>
                  </motion.div>
                ) : (
                  <EmptyState onLoadSample={loadSampleData} />
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          </div>
        </main>
        
        <Footer />
      </div>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? '#f9fafb' : '#1f2937',
            border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
            borderRadius: '12px',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
    </div>
  );
}

export default App;