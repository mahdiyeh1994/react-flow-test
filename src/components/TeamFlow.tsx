import React, { FC, DragEvent, useCallback, useState } from 'react';
import { ReactFlow, MiniMap, Controls, addEdge, Connection, Edge, Node } from '@xyflow/react';
import { v4 as uuid } from 'uuid';
import { useTeamStore } from 'src/store/teamStore';

interface NodeData extends Record<string, unknown> {
  label: JSX.Element;
}

type FlowNode = Node<NodeData>;
type FlowEdge = Edge;

interface ModalState {
  open: boolean;
  id: string | null;
}
export const TeamFlow: FC = () => {
  const { members, addMember } = useTeamStore();
  const [nodes, setNodes] = useState<FlowNode[]>(
    members.map((m) => ({
      id: m.id,
      data: {
        label: (
          <div
            className="p-2 border rounded cursor-pointer"
            onClick={() => onNodeClick(m.id)}
          >
            <strong>{m.name}</strong>
            <div className="text-sm">{m.role}</div>
          </div>
        ),
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    }))
  );
  const [edges, setEdges] = useState<FlowEdge[]>(
    members
      .filter((m) => m.parentId)
      .map((m) => ({
        id: `${m.parentId}-${m.id}`,
        source: m.parentId!,
        target: m.id,
      }))
  );
  const [modal, setModal] = useState<ModalState>({ open: false, id: null });

  const onConnect = (params: FlowEdge | Connection) =>
    setEdges((es) => addEdge(params, es));

  const onNodeClick = (id: string) => setModal({ open: true, id });

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const name = prompt('Member name');
      const role = prompt('Member role');
      if (name && role) {
        const id = uuid();
        addMember({ id, name, role });
        setNodes((ns) => [
          ...ns,
          {
            id,
            data: {
              label: (
                <div
                  className="p-2 border rounded cursor-pointer"
                  onClick={() => onNodeClick(id)}
                >
                  <strong>{name}</strong>
                  <div className="text-sm">{role}</div>
                </div>
              ),
            },
            position: { x: event.clientX, y: event.clientY },
          },
        ]);
      }
    },
    [addMember]
  );

  return (
    <div
      className="w-full h-screen"
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <ReactFlow nodes={nodes} edges={edges} onConnect={onConnect} fitView>
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};
