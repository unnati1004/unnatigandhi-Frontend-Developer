import dagre from "dagre";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 80;

export const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  // Set up nodes in Dagre graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Set up edges in Dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Assign layouted positions to nodes
  const layoutedNodes = nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);
    const x = dagreNode?.x ?? 0;
    const y = dagreNode?.y ?? 0;

    return {
      ...node,
      position: { x: x - nodeWidth / 2, y: y - nodeHeight / 2 },
      sourcePosition: isHorizontal ? "right" : "bottom",
      targetPosition: isHorizontal ? "left" : "top",
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
};
