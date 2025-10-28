import { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit3, Check, X, Plus, Trash2, Copy, 
  ChevronDown, ChevronRight, Key, Hash, 
  Type, ToggleLeft, Brackets, Braces
} from 'lucide-react';
import toast from 'react-hot-toast';

const EditableNode = ({ data, selected, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.value || '');
  const [editKey, setEditKey] = useState(data.key || '');
  const [isExpanded, setIsExpanded] = useState(data.expanded !== false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const inputRef = useRef(null);
  const keyInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const getNodeIcon = () => {
    switch (data.type) {
      case 'object': return <Braces className="w-4 h-4" />;
      case 'array': return <Brackets className="w-4 h-4" />;
      case 'string': return <Type className="w-4 h-4" />;
      case 'number': return <Hash className="w-4 h-4" />;
      case 'boolean': return <ToggleLeft className="w-4 h-4" />;
      case 'null': return <X className="w-4 h-4" />;
      default: return <Key className="w-4 h-4" />;
    }
  };

  const getNodeColor = () => {
    if (data.isHighlighted) return 'from-amber-400 to-orange-500';
    switch (data.type) {
      case 'object': return 'from-blue-500 to-indigo-600';
      case 'array': return 'from-emerald-500 to-teal-600';
      case 'string': return 'from-purple-500 to-violet-600';
      case 'number': return 'from-orange-500 to-red-500';
      case 'boolean': return 'from-green-500 to-emerald-600';
      case 'null': return 'from-gray-500 to-slate-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const handleSave = () => {
    if (data.onUpdate) {
      data.onUpdate(id, {
        key: editKey,
        value: editValue,
        type: data.type
      });
    }
    setIsEditing(false);
    toast.success('Node updated!', { icon: '✏️' });
  };

  const handleCancel = () => {
    setEditValue(data.value || '');
    setEditKey(data.key || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
      toast.success('Node deleted!', { icon: '🗑️' });
    }
  };

  const handleAddChild = (type) => {
    if (data.onAddChild) {
      data.onAddChild(id, type);
      toast.success(`Added ${type} child!`, { icon: '➕' });
    }
    setShowAddMenu(false);
  };

  const copyPath = () => {
    if (data.path) {
      navigator.clipboard.writeText(data.path);
      toast.success('Path copied to clipboard!', { icon: '📋' });
    }
  };

  const canHaveChildren = data.type === 'object' || data.type === 'array';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: selected ? 1.05 : 1,
        boxShadow: selected ? '0 0 20px rgba(59, 130, 246, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.1)'
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
      }}
      className={`
        relative min-w-[200px] max-w-[300px] p-4 rounded-xl border-2 backdrop-blur-sm
        ${selected 
          ? 'border-blue-400 dark:border-blue-500 bg-blue-50/80 dark:bg-blue-900/20' 
          : 'border-white/30 dark:border-gray-600/30 bg-white/80 dark:bg-gray-800/80'
        }
        transition-all duration-300 group
      `}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-white"
      />

      {/* Node Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {canHaveChildren && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="down"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: -90 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="right"
                    initial={{ rotate: 90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 90 }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
          
          <div className={`p-2 rounded-lg bg-gradient-to-r ${getNodeColor()} shadow-md`}>
            <div className="text-white">
              {getNodeIcon()}
            </div>
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {data.type}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={copyPath}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Copy path"
          >
            <Copy className="w-3 h-3" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-blue-600 dark:text-blue-400"
            title="Edit node"
          >
            <Edit3 className="w-3 h-3" />
          </motion.button>
          
          {canHaveChildren && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="p-1.5 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-green-600 dark:text-green-400"
                title="Add child"
              >
                <Plus className="w-3 h-3" />
              </motion.button>
              
              <AnimatePresence>
                {showAddMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[120px]"
                  >
                    {['string', 'number', 'boolean', 'object', 'array'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleAddChild(type)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
                      >
                        {type}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="p-1.5 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-red-600 dark:text-red-400"
            title="Delete node"
          >
            <Trash2 className="w-3 h-3" />
          </motion.button>
        </div>
      </div>

      {/* Node Content */}
      <div className="space-y-2">
        {/* Key */}
        {data.key && (
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Key</label>
            {isEditing ? (
              <input
                ref={keyInputRef}
                value={editKey}
                onChange={(e) => setEditKey(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter key..."
              />
            ) : (
              <div className="font-mono text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                {data.key}
              </div>
            )}
          </div>
        )}

        {/* Value */}
        {data.value !== undefined && data.value !== null && (
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Value</label>
            {isEditing ? (
              <textarea
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={Math.min(4, Math.max(1, String(editValue).split('\n').length))}
                placeholder="Enter value..."
              />
            ) : (
              <div className="font-mono text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-md break-words">
                {String(data.value)}
              </div>
            )}
          </div>
        )}

        {/* Edit Actions */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition-colors flex items-center justify-center gap-1"
              >
                <Check className="w-3 h-3" />
                Save
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="flex-1 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md transition-colors flex items-center justify-center gap-1"
              >
                <X className="w-3 h-3" />
                Cancel
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Children count indicator */}
      {canHaveChildren && data.childCount > 0 && (
        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
          {data.childCount}
        </div>
      )}
    </motion.div>
  );
};

export default EditableNode;