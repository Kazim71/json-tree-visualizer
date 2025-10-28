export const parseJSON = (input) => {
  try {
    const parsed = JSON.parse(input);
    return { success: true, data: parsed };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const generateTreeNodes = (data, parentPath = '$') => {
  const nodes = [];
  const edges = [];
  let nodeId = 0;
  let yPosition = 0;

  const createNode = (key, value, path, parentId = null, level = 0) => {
    const id = `node-${nodeId++}`;
    const type = getValueType(value);
    
    nodes.push({
      id,
      type: 'custom',
      position: { 
        x: level * 300, 
        y: yPosition 
      },
      data: {
        key,
        value,
        type,
        path,
        isRoot: parentId === null,
        level
      }
    });

    yPosition += 120; // Increment Y position for next node

    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${id}`,
        source: parentId,
        target: id,
        type: 'smoothstep',
        style: { strokeWidth: 2, stroke: '#94a3b8' }
      });
    }

    if (type === 'object' && value !== null) {
      Object.entries(value).forEach(([childKey, childValue]) => {
        createNode(childKey, childValue, `${path}.${childKey}`, id, level + 1);
      });
    } else if (type === 'array') {
      value.forEach((childValue, index) => {
        createNode(`[${index}]`, childValue, `${path}[${index}]`, id, level + 1);
      });
    }

    return id;
  };

  createNode('root', data, parentPath);
  return { nodes, edges };
};

const getValueType = (value) => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  return 'primitive';
};

export const searchInTree = (nodes, query) => {
  if (!query.trim()) return [];
  
  return nodes.filter(node => {
    const { path, key, value } = node.data;
    const searchStr = query.toLowerCase();
    
    return path.toLowerCase().includes(searchStr) ||
           key.toLowerCase().includes(searchStr) ||
           String(value).toLowerCase().includes(searchStr);
  });
};