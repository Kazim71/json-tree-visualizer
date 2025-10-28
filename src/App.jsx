import { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Moon, Sun, Sparkles, Database, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import JSONInput from './components/JSONInput';
import SearchBar from './components/SearchBar';
import TreeVisualization from './components/TreeVisualization';
import EmptyState from './components/EmptyState';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { parseJSON, generateTreeNodes, searchInTree } from './utils/jsonParser';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

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

  const handleTreeUpdate = (updatedNodes, updatedEdges) => {
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleExport = () => {
    // This will be handled by TreeVisualization component
    const event = new CustomEvent('exportTree');
    window.dispatchEvent(event);
  };

  const handleImport = (jsonData) => {
    handleVisualize(jsonData);
  };

  const handleZoomIn = () => {
    const event = new CustomEvent('zoomIn');
    window.dispatchEvent(event);
  };

  const handleZoomOut = () => {
    const event = new CustomEvent('zoomOut');
    window.dispatchEvent(event);
  };

  const handleReset = () => {
    const event = new CustomEvent('resetView');
    window.dispatchEvent(event);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const addToHistory = (nodes, edges) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...nodes], edges: [...edges] });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
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
          isEditMode={isEditMode}
          toggleEditMode={toggleEditMode}
          onSearch={handleSearch}
          searchResults={searchResults}
          onExport={handleExport}
          onImport={handleImport}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
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
                error={error}
                isLoading={isLoading}
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
              className="xl:col-span-8"
            >
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
                        isEditMode={isEditMode}
                        toggleEditMode={toggleEditMode}
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
      
      <KeyboardShortcuts />
    </div>
  );
}

export default App;