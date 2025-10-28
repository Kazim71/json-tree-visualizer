import { Handle, Position } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Copy, Database, List, Hash, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CustomNode = ({ data, selected }) => {
  if (!data) {
    return <div className="p-4 bg-red-200 rounded">No data</div>;
  }
  
  const { key, value, type, path, isRoot, isHighlighted } = data;
  const [isHovered, setIsHovered] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  
  const getNodeStyles = () => {
    const baseStyles = 'relative overflow-hidden backdrop-blur-sm border-2 transition-all duration-300 shadow-lg';
    
    if (isHighlighted) {
      return `${baseStyles} bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-800/40 border-amber-400 dark:border-amber-500 text-amber-900 dark:text-amber-100 shadow-amber-400/25 animate-pulse-glow`;
    }
    
    switch (type) {
      case 'object': 
        return `${baseStyles} bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-300 dark:border-blue-600 text-blue-900 dark:text-blue-100 hover:shadow-blue-400/25`;
      case 'array': 
        return `${baseStyles} bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 border-emerald-300 dark:border-emerald-600 text-emerald-900 dark:text-emerald-100 hover:shadow-emerald-400/25`;
      case 'primitive': 
        return `${baseStyles} bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-300 dark:border-purple-600 text-purple-900 dark:text-purple-100 hover:shadow-purple-400/25`;
      case 'null': 
        return `${baseStyles} bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-700/30 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:shadow-gray-400/25`;
      default: 
        return `${baseStyles} bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-700/30 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:shadow-gray-400/25`;
    }
  };

  const getIcon = () => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'object': return <Database className={iconClass} />;
      case 'array': return <List className={iconClass} />;
      case 'primitive': return <Hash className={iconClass} />;
      case 'null': return <FileText className={iconClass} />;
      default: return <FileText className={iconClass} />;
    }
  };

  const getDisplayValue = () => {
    if (type === 'object' && value !== null) {
      const count = Object.keys(value).length;
      return `{${count} ${count === 1 ? 'key' : 'keys'}}`;
    }
    if (type === 'array') {
      const count = value.length;
      return `[${count} ${count === 1 ? 'item' : 'items'}]`;
    }
    if (type === 'primitive') {
      const str = String(value);
      if (typeof value === 'string') {
        return str.length > 15 ? `"${str.substring(0, 15)}..."` : `"${str}"`;
      }
      if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
      }
      if (typeof value === 'number') {
        return str;
      }
      return str.length > 20 ? `${str.substring(0, 20)}...` : str;
    }
    return 'null';
  };

  const getTypeColor = () => {
    switch (type) {
      case 'object': return 'text-blue-600 dark:text-blue-400';
      case 'array': return 'text-emerald-600 dark:text-emerald-400';
      case 'primitive': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const copyPath = async () => {
    try {
      await navigator.clipboard.writeText(path);
      setJustCopied(true);
      
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Path copied!</span>
        </div>,
        {
          duration: 2000,
          style: {
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
          },
        }
      );
      
      setTimeout(() => setJustCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy path');
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -10 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        rotate: 0,
        y: isHighlighted ? [-2, 2, -2] : 0
      }}
      whileHover={{ 
        scale: 1.05, 
        y: -4,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        rotate: [0, 1, -1, 0]
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
        y: isHighlighted ? { duration: 2, repeat: Infinity } : {}
      }}
      className={`
        px-4 py-3 rounded-xl min-w-[140px] max-w-[200px] cursor-pointer group
        ${getNodeStyles()}
        ${selected ? 'ring-2 ring-purple-400/50 shadow-xl shadow-purple-400/25' : ''}
        ${isHovered ? 'shadow-xl' : 'shadow-md'}
      `}
      onClick={copyPath}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white shadow-lg hover:scale-125 transition-transform"
        />
      )}
      
      <div className="text-center space-y-2">
        {/* Icon and Key */}
        <div className="flex items-center justify-center gap-2">
          <div className={`p-1 rounded ${getTypeColor()}`}>
            {getIcon()}
          </div>
          <span className="font-semibold text-sm truncate max-w-[100px]">
            {isRoot ? 'root' : key}
          </span>
        </div>
        
        {/* Value Display */}
        <div className="text-xs font-mono opacity-80 truncate">
          {getDisplayValue()}
        </div>
        
        {/* Type Badge */}
        <div className={`text-xs font-medium uppercase ${getTypeColor()}`}>
          {type}
        </div>
      </div>
      
      {/* Copy Indicator */}
      <AnimatePresence>
        {(isHovered || justCopied) && (
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: 0,
              backgroundColor: justCopied ? '#10b981' : 'rgba(255, 255, 255, 0.9)'
            }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute -top-2 -right-2 rounded-full p-2 shadow-lg border-2 border-white dark:border-gray-800"
          >
            {justCopied ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : (
              <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Highlight Glow Effect */}
      {isHighlighted && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/20 to-orange-400/20 pointer-events-none"
          animate={{ 
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Selection Ring */}
      {selected && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-4 border-purple-400 pointer-events-none"
          animate={{ 
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Hover Shimmer Effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white shadow-lg hover:scale-125 transition-transform"
      />
    </motion.div>
  );
};

export default CustomNode;