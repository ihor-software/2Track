import React from 'react';
import TaskItem from './TaskItem';
import { Task } from '../store/tasksSlice';

interface TaskListProps {
  tasks: Task[];
  section: 'today' | 'tomorrow';
}

const TaskList: React.FC<TaskListProps> = ({ tasks, section }) => {
  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks for this section.</p>
      ) : (
        tasks.map((task) => (
          <TaskItem key={task.id} task={task} section={section} />
        ))
      )}
    </div>
  );
};

export default TaskList;

