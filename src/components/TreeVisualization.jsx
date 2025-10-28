import { useEffect, useState } from 'react';
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
import { Download, Eye, EyeOff, Layers, Edit3, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

const nodeTypes = {
  custom: CustomNode,
  editable: EditableNode,
};

const TreeVisualization = ({ nodes: initialNodes, edges: initialEdges, searchResults, isLoading, onTreeUpdate }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (initialNodes.length > 0) {
      // Add search highlighting to nodes
      const nodesWithHighlight = initialNodes.map(node => ({
        ...node,
        type: editMode ? 'editable' : 'custom',
        selected: searchResults.some(result => result.id === node.id),
        data: {
          ...node.data,
          isHighlighted: searchResults.some(result => result.id === node.id),
          onUpdate: editMode ? handleNodeUpdate : undefined,
          onDelete: editMode ? handleNodeDelete : undefined,
          onAddChild: editMode ? handleAddChild : undefined,
        }
      }));

      setNodes(nodesWithHighlight);
      setEdges(initialEdges);
      
      // Store original data when entering edit mode
      if (editMode && !originalData) {
        setOriginalData({ nodes: initialNodes, edges: initialEdges });
      }
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [initialNodes, initialEdges, searchResults, editMode, setNodes, setEdges]);

  const handleNodeUpdate = (nodeId, newData) => {
    setNodes(currentNodes => 
      currentNodes.map(node => 
        node.id === nodeId 
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                key: newData.key,
                value: newData.value 
              } 
            }
          : node
      )
    );
  };

  const handleNodeDelete = (nodeId) => {
    setNodes(currentNodes => currentNodes.filter(node => node.id !== nodeId));
    setEdges(currentEdges => currentEdges.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
  };

  const handleAddChild = (parentId, childType) => {
    const newNodeId = `${parentId}-child-${Date.now()}`;
    const parentNode = nodes.find(node => node.id === parentId);
    
    if (parentNode) {
      const newNode = {
        id: newNodeId,
        type: 'editable',
        position: {
          x: parentNode.position.x + Math.random() * 200 - 100,
          y: parentNode.position.y + 150
        },
        data: {
          key: `new_${childType}`,
          value: childType === 'string' ? 'new value' : 
                 childType === 'number' ? 0 : 
                 childType === 'boolean' ? true : 
                 childType === 'object' ? {} : [],
          type: childType,
          path: `${parentNode.data.path}.new_${childType}`,
          onUpdate: handleNodeUpdate,
          onDelete: handleNodeDelete,
          onAddChild: handleAddChild,
        }
      };
      
      const newEdge = {
        id: `${parentId}-${newNodeId}`,
        source: parentId,
        target: newNodeId,
        type: 'smoothstep',
        animated: false,
        style: { strokeWidth: 2, stroke: '#94a3b8' }
      };
      
      setNodes(currentNodes => [...currentNodes, newNode]);
      setEdges(currentEdges => [...currentEdges, newEdge]);
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      // Exiting edit mode - could save changes here
      toast.success('Edit mode disabled');
    } else {
      // Entering edit mode
      toast.success('Edit mode enabled! Click nodes to edit them.');
    }
    setEditMode(!editMode);
  };

  const saveChanges = () => {
    if (onTreeUpdate) {
      // Convert current nodes back to JSON structure
      const updatedData = reconstructJSONFromNodes(nodes);
      onTreeUpdate(updatedData);
    }
    setEditMode(false);
    setOriginalData(null);
    toast.success('Changes saved successfully!');
  };

  const reconstructJSONFromNodes = (nodeList) => {
    // This is a simplified reconstruction - in a real app you'd want more sophisticated logic
    const result = {};
    nodeList.forEach(node => {
      if (node.data.key && node.data.value !== undefined) {
        result[node.data.key] = node.data.value;
      }
    });
    return result;
  };

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
        id: 'download'
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to download image. Please try again.', { id: 'download' });
    } finally {
      setIsDownloading(false);
    }
  };

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
            animate={{ 
              rotate: isLoading ? 360 : 0,
              scale: isLoading ? [1, 1.1, 1] : 1
            }}
            whileHover={{ 
              scale: 1.1, 
              rotate: 180,
              boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)"
            }}
            transition={{ 
              duration: isLoading ? 1 : 0.3, 
              repeat: isLoading ? Infinity : 0, 
              ease: "linear" 
            }}
            className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg cursor-pointer"
          >
            <Layers className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white text-lg">Tree Visualization</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {nodes.length} nodes • {editMode ? 'Edit Mode Active' : 'Interactive & zoomable'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mr-4">
          {/* View Controls */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMiniMap(!showMiniMap)}
              className={`p-2 rounded-xl transition-all duration-200 shadow-md ${
                showMiniMap 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-blue-200 dark:shadow-blue-800' 
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="Toggle Minimap"
            >
              <AnimatePresence mode="wait">
                {showMiniMap ? (
                  <motion.div
                    key="eye"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                  >
                    <Eye className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="eye-off"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                  >
                    <EyeOff className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleEditMode}
              className={`p-2 rounded-xl transition-all duration-200 shadow-md ${
                editMode 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-green-200 dark:shadow-green-800' 
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title={editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>
          </div>
          
          <AnimatePresence>
            {editMode && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: "0 8px 25px rgba(34, 197, 94, 0.25)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={saveChanges}
                className="btn-secondary bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 flex items-center gap-2 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline font-semibold">Save</span>
              </motion.button>
            )}
          </AnimatePresence>
          
          {/* Download Button */}
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              y: -2,
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadImage}
            disabled={isDownloading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
                  initial={{ opacity: 0, scale: 0, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: -10 }}
                  whileHover={{ y: -2 }}
                >
                  <Download className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="hidden sm:inline font-semibold">Export</span>
          </motion.button>
        </div>
      </div>
      
      {/* React Flow */}
      <div className="flex-1 relative" style={{ height: '500px' }}>
        <ReactFlow
          nodes={nodes}
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
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <Background 
            color="#94a3b8" 
            gap={20} 
            size={1}
            className="opacity-30 dark:opacity-20"
          />
          
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