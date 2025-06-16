import React, { FC, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTeamStore } from 'src/store/teamStore';
import { Button } from './ui/button';

interface EditMemberModalProps {
  open: boolean;
  onClose: () => void;
  memberId: string;
}

export const EditMemberModal: FC<EditMemberModalProps> = ({ open, onClose, memberId }) => {
  const member = useTeamStore((state) =>
    state.members.find((m) => m.id === memberId)
  );
  const {updateMember} = useTeamStore();
  const [name, setName] = useState<string>(member?.name ?? '');

  const save = () => {
    updateMember(memberId, { name });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-white">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        <DialogFooter>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};