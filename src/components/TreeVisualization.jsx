import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import EditableNode from './EditableNode';
import { ZoomIn, ZoomOut, Maximize, Download, RotateCcw, Eye, EyeOff, Layers, Edit3, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

const nodeTypes = {
  custom: CustomNode,
  editable: EditableNode,
};

const TreeVisualization = ({ nodes: initialNodes, edges: initialEdges, searchResults, isLoading, isEditMode: externalEditMode, toggleEditMode: externalToggleEditMode, onTreeUpdate }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [showBackground, setShowBackground] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Sync with external edit mode
  useEffect(() => {
    if (externalEditMode !== undefined) {
      setIsEditMode(externalEditMode);
    }
  }, [externalEditMode]);

  // Listen for navbar events
  useEffect(() => {
    const handleExportTree = () => downloadImage();
    const handleZoomIn = () => zoomIn();
    const handleZoomOut = () => zoomOut();
    const handleResetView = () => resetView();

    window.addEventListener('exportTree', handleExportTree);
    window.addEventListener('zoomIn', handleZoomIn);
    window.addEventListener('zoomOut', handleZoomOut);
    window.addEventListener('resetView', handleResetView);

    return () => {
      window.removeEventListener('exportTree', handleExportTree);
      window.removeEventListener('zoomIn', handleZoomIn);
      window.removeEventListener('zoomOut', handleZoomOut);
      window.removeEventListener('resetView', handleResetView);
    };
  }, []);
  const [originalNodes, setOriginalNodes] = useState([]);
  const [originalEdges, setOriginalEdges] = useState([]);
  const { fitView, zoomIn, zoomOut, getViewport } = useReactFlow();



  const toggleEditMode = () => {
    if (externalToggleEditMode) {
      externalToggleEditMode();
    } else {
      if (!isEditMode) {
        setOriginalNodes([...nodes]);
        setOriginalEdges([...edges]);
      }
      setIsEditMode(!isEditMode);
    }
  };

  const saveChanges = () => {
    setIsEditMode(false);
    if (onTreeUpdate) {
      onTreeUpdate(nodes, edges);
    }
    toast.success('Changes saved!');
  };

  const cancelChanges = () => {
    setNodes(originalNodes);
    setEdges(originalEdges);
    setIsEditMode(false);
    toast.success('Changes cancelled');
  };

  const handleNodeEdit = (nodeId, newKey) => {
    setNodes(nds => nds.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, key: newKey } }
        : node
    ));
  };

  const handleNodeDelete = (nodeId) => {
    setNodes(nds => nds.filter(node => node.id !== nodeId));
    setEdges(eds => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
  };

  const handleAddChild = (parentId) => {
    const newNodeId = `node-${Date.now()}`;
    const parentNode = nodes.find(n => n.id === parentId);
    
    if (parentNode) {
      const newNode = {
        id: newNodeId,
        type: isEditMode ? 'editable' : 'custom',
        position: { 
          x: parentNode.position.x + 200, 
          y: parentNode.position.y + 100 
        },
        data: {
          key: 'newKey',
          value: 'newValue',
          type: 'primitive',
          path: `${parentNode.data.path}.newKey`,
          isRoot: false
        }
      };
      
      const newEdge = {
        id: `edge-${parentId}-${newNodeId}`,
        source: parentId,
        target: newNodeId,
        type: 'smoothstep',
        style: { strokeWidth: 2, stroke: '#94a3b8' }
      };
      
      setNodes(nds => [...nds, newNode]);
      setEdges(eds => [...eds, newEdge]);
    }
  };

  useEffect(() => {
    if (initialNodes.length > 0) {
      // Add search highlighting to nodes
      const nodesWithHighlight = initialNodes.map(node => ({
        ...node,
        type: isEditMode ? 'editable' : 'custom',
        selected: searchResults.some(result => result.id === node.id),
        data: {
          ...node.data,
          isHighlighted: searchResults.some(result => result.id === node.id)
        }
      }));

      setNodes(nodesWithHighlight);
      setEdges(initialEdges);
      
      if (!isEditMode) {
        setOriginalNodes(nodesWithHighlight);
        setOriginalEdges(initialEdges);
      }
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [initialNodes, initialEdges, searchResults, isEditMode, setNodes, setEdges]);

  const downloadImage = async () => {
    setIsDownloading(true);
    try {
      if (nodes.length === 0) {
        toast.error('No tree to export', { id: 'download' });
        return;
      }

      toast.loading('Generating image...', { id: 'download' });
      
      // Get the React Flow container
      const reactFlowElement = document.querySelector('.react-flow');
      if (!reactFlowElement) {
        throw new Error('React Flow element not found');
      }

      // Temporarily set a white background for export
      const originalBg = reactFlowElement.style.backgroundColor;
      reactFlowElement.style.backgroundColor = '#ffffff';
      
      const canvas = await html2canvas(reactFlowElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: reactFlowElement.offsetWidth,
        height: reactFlowElement.offsetHeight
      });
      
      // Restore original background
      reactFlowElement.style.backgroundColor = originalBg;
      
      const link = document.createElement('a');
      link.download = `json-tree-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
      toast.success('Image downloaded successfully!', { 
        id: 'download',
        icon: '📸'
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to download image. Please try again.', { id: 'download' });
    } finally {
      setIsDownloading(false);
    }
  };

  const resetView = () => {
    fitView({ duration: 800, padding: 0.1 });
    toast.success('View reset!', { icon: '🎯' });
  };

  const controlButtons = [
    {
      icon: ZoomIn,
      label: 'Zoom In',
      action: () => zoomIn(),
      shortcut: '+'
    },
    {
      icon: ZoomOut,
      label: 'Zoom Out', 
      action: () => zoomOut(),
      shortcut: '-'
    },
    {
      icon: Maximize,
      label: 'Fit View',
      action: resetView,
      shortcut: '0'
    },
    {
      icon: RotateCcw,
      label: 'Reset View',
      action: resetView,
      shortcut: 'R'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-card overflow-hidden"
      style={{ height: '600px', minHeight: '600px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-gray-700/30">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isLoading ? 360 : 0 }}
            transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
            className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg"
          >
            <Layers className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white text-lg flex items-center gap-2">
              Tree Visualization
              {isEditMode && (
                <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
                  EDIT MODE
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {nodes.length} nodes • {isEditMode ? 'Click to edit, hover for controls' : 'Interactive & zoomable'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Edit Mode Controls */}
          {isEditMode ? (
            <div className="flex items-center gap-2 mr-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveChanges}
                className="btn-primary text-sm py-2 px-3 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={cancelChanges}
                className="btn-secondary text-sm py-2 px-3 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleEditMode}
              className="btn-secondary mr-3 flex items-center gap-2"
              disabled={nodes.length === 0}
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </motion.button>
          )}
          
          {/* View Controls */}
          <div className="flex items-center gap-1 mr-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMiniMap(!showMiniMap)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                showMiniMap 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title="Toggle Minimap"
            >
              {showMiniMap ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </motion.button>
          </div>

          {/* Control Buttons */}
          {controlButtons.map((button, index) => (
            <motion.button
              key={button.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={button.action}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 group relative"
              title={`${button.label} (${button.shortcut})`}
            >
              <button.icon className="w-4 h-4" />
              
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {button.label}
              </div>
            </motion.button>
          ))}
          
          {/* Download Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadImage}
            disabled={isDownloading}
            className="btn-secondary ml-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <AnimatePresence mode="wait">
              {isDownloading ? (
                <motion.div
                  key="downloading"
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, rotate: { duration: 1, repeat: Infinity, ease: "linear" } }}
                >
                  <Download className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="download"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <Download className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="hidden sm:inline">Export</span>
          </motion.button>
        </div>
      </div>
      
      {/* React Flow */}
      <div className="flex-1 relative" style={{ height: '500px' }}>
        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              isEditMode,
              onNodeEdit: handleNodeEdit,
              onNodeDelete: handleNodeDelete,
              onAddChild: handleAddChild
            }
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          attributionPosition="bottom-left"
          className="w-full h-full"
          style={{ background: 'transparent' }}
          minZoom={0.1}
          maxZoom={2}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: false,
            style: { strokeWidth: 2, stroke: '#94a3b8' }
          }}
          nodesDraggable={isEditMode}
          nodesConnectable={isEditMode}
          elementsSelectable={true}
        >
          {showBackground && (
            <Background 
              color="#94a3b8" 
              gap={20} 
              size={1}
              className="opacity-30 dark:opacity-20"
            />
          )}
          
          <Controls 
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-xl shadow-lg"
            showInteractive={false}
          />
          
          {showMiniMap && (
            <MiniMap 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-xl shadow-lg"
              nodeColor={(node) => {
                if (node.data?.isHighlighted) return '#f59e0b';
                switch (node.data?.type) {
                  case 'object': return '#3b82f6';
                  case 'array': return '#10b981';
                  case 'primitive': return '#f59e0b';
                  default: return '#6b7280';
                }
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          )}
        </ReactFlow>
        
        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-10"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto"
                >
                  <Layers className="w-6 h-6 text-white" />
                </motion.div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Generating tree structure...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TreeVisualization;