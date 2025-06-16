import React, { FC, useState, useEffect, useCallback, DragEvent } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  addEdge,
  Connection,
  Edge,
  Node,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { v4 as uuid } from "uuid";
import { useTeamStore } from "src/store/teamStore";
import { sampleMembers } from "@/lib/data";
import { Member } from "@/types/memberInterfaces";
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
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(
    members.map((m) => ({
      id: m.id,
      data: {
        label: renderLabel(m),
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    }))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  // Update node labels when members change without affecting position
  useEffect(() => {
    setNodes((current) =>
      current.map((node) => {
        const m = members.find((mem) => mem.id === node.id);
        return m ? { ...node, data: { label: renderLabel(m) } } : node;
      })
    );
  }, [members]);

  // Render nodes with style
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
  }
  const onConnect = useCallback(
    (params: FlowEdge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onNodeClick = (id: string) => setModal({ open: true, id });

  // Drag-and-drop from sidebar
  const onDragStart = (event: React.DragEvent, member: Omit<Member, "id">) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(member));
    event.dataTransfer.effectAllowed = "move";
  };
  // Drop handler: parse sample, assign id, store
  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;
      const { name, role } = JSON.parse(data);
      const id = uuid();
      const newMember: Member = { id, name, role };
      addMember(newMember);
      setNodes((ns) => [
        ...ns,
        {
          id,
          data: { label: renderLabel(newMember) },
          position: { x: event.clientX, y: event.clientY },
        },
      ]);
    },
    [addMember]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className="flex flex-row grow h-full">
      {/* Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
      {/* Sidebar */}
      <div className="w-1/6 h-full  p-4 bg-gray-50 border-r space-y-2">
        {sampleMembers.map((sm, index) => (
          <div
            key={index}
            className="p-2 bg-white border rounded cursor-move"
            draggable
            onDragStart={(e) => onDragStart(e, sm)}
          >
            {sm.name} — <span className="italic">{sm.role}</span>
          </div>
        ))}
      </div>
      {/* Edit modal */}
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
