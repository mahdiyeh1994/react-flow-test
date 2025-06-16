import { Member } from "@/types/memberInterfaces";

// Define sample members to drag from sidebar
export const sampleMembers: Omit<Member, 'id'>[] = [
  { name: 'Charlie', role: 'Designer' },
  { name: 'Dana', role: 'QA Engineer' },
  { name: 'Evan', role: 'Product Owner' },
];