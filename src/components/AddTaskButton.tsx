import React, { useState } from 'react';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { TaskModal } from './TaskModal';

interface AddTaskButtonProps {
  section: 'today' | 'tomorrow';
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ section }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} className="mt-4">
        <Plus className="mr-2 h-4 w-4" /> Add Task
      </Button>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={{ section } as any}
      />
    </>
  );
};

export default AddTaskButton;
