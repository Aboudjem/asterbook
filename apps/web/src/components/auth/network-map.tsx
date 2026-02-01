'use client';

interface NetworkMapProps {
  className?: string;
}

export function NetworkMap({ className = '' }: NetworkMapProps) {
  // Node positions (percentage based for responsiveness)
  const nodes = [
    { id: 1, x: 15, y: 25, isAccent: false },
    { id: 2, x: 35, y: 45, isAccent: true },
    { id: 3, x: 55, y: 20, isAccent: false },
    { id: 4, x: 75, y: 55, isAccent: false },
    { id: 5, x: 25, y: 70, isAccent: false },
    { id: 6, x: 60, y: 75, isAccent: false },
    { id: 7, x: 85, y: 30, isAccent: false },
  ];

  // Calculate link properties between two nodes
  const calculateLink = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    return { length, angle };
  };

  // Define connections between nodes (pairs of node indices)
  const connections = [
    [0, 1], [1, 2], [2, 3], [1, 4], [3, 5], [2, 6], [4, 5], [0, 4],
  ];

  return (
    <div className={`ac-map ${className}`}>
      <div className="ac-map-grid">
        {/* Render connection lines */}
        {connections.map(([from, to], index) => {
          const fromNode = nodes[from];
          const toNode = nodes[to];
          const { length, angle } = calculateLink(
            fromNode.x,
            fromNode.y,
            toNode.x,
            toNode.y
          );
          return (
            <div
              key={`link-${index}`}
              className="ac-link"
              style={{
                left: `${fromNode.x}%`,
                top: `${fromNode.y}%`,
                width: `${length}%`,
                transform: `rotate(${angle}deg)`,
              }}
            />
          );
        })}

        {/* Render nodes */}
        {nodes.map((node) => (
          <div
            key={`node-${node.id}`}
            className={`ac-node ${node.isAccent ? 'is-accent' : ''}`}
            style={{
              left: `calc(${node.x}% - 5px)`,
              top: `calc(${node.y}% - 5px)`,
            }}
          />
        ))}
      </div>

      <div className="ac-map-caption">
        <span>
          <strong>7</strong> connected nodes
        </span>
        <span style={{ color: 'var(--ac-accent-2)' }}>
          Network active
        </span>
      </div>
    </div>
  );
}

export default NetworkMap;
