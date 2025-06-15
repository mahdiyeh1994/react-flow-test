import React, { FC, useState, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  addEdge,
  Connection,
  Edge,
  Node,
} from "@xyflow/react";
import { useTeamStore } from "src/store/teamStore";
import { EditMemberModal } from "./EditMemberModal";

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
  const [modal, setModal] = useState<ModalState>({ open: false, id: null });
  const [nodes, setNodes] = useState<FlowNode[]>(
    members.map((m) => ({
      id: m.id,
      data: {
        label: renderLabel(m),
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
  // Update node labels when members change without affecting position
  useEffect(() => {
    setNodes((current) =>
      current.map((node) => {
        const m = members.find((mem) => mem.id === node.id);
        return m
          ? { ...node, data: { label: renderLabel(m) } }
          : node;
      })
    );
  }, [members]);
  function renderLabel(member: { id: string; name: string; role: string }) {
    return (
      <div
        className="p-2 border rounded cursor-pointer"
        onClick={() => onNodeClick(member.id)}
      >
        <strong>{member.name}</strong>
        <div className="text-sm">{member.role}</div>
      </div>
    );
  };
  const onConnect = (params: FlowEdge | Connection) =>
    setEdges((es) => addEdge(params, es));

  const onNodeClick = (id: string) => setModal({ open: true, id });

  return (
    <div
      className="w-full h-screen"
    >
      <ReactFlow nodes={nodes} edges={edges} onConnect={onConnect} fitView>
        <MiniMap />
        <Controls />
      </ReactFlow>

      {modal.id && (
        <EditMemberModal
          open={modal.open}
          memberId={modal.id}
          onClose={() => setModal({ open: false, id: null })}
        />
      )}
    </div>
  );
};
