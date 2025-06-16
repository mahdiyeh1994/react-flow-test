import { Member } from '@/types/memberInterfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TeamState = {
  members: Member[];
  addMember: (member: Member) => void;
  updateMember: (id: string, data: Partial<Member>) => void;
};

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      members: [
        { id: '1', name: 'Alice', role: 'Manager' },
        { id: '2', name: 'Bob', role: 'Developer', parentId: '1' },
      ],
      addMember: (member:Member) => set((state: { members: Member[] }) => ({ members: [...state.members, member] })),
      updateMember: (id: string, data: Partial<Member>) =>
        set((state: { members: Member[] }) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, ...data } : m
          ),
        })),
    }),
    { name: 'team-store' }
  )
);