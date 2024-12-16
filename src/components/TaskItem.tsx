import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask, pauseTask, Task } from '../store/tasksSlice';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Trash, Play, Pause, Edit } from 'lucide-react';
import { TaskModal } from './TaskModal';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface TaskItemProps {
  task: Task;
  section: 'today' | 'tomorrow';
}

const TaskItem: React.FC<TaskItemProps> = ({ task, section }) => {
  const dispatch = useDispatch();
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(task.remainingTime || 25 * 60);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleCheckboxChange = () => {
    dispatch(updateTask({ ...task, checked: !task.checked }));
  };

  const handleDelete = async () => {
    if (!task.id) {
      console.error('Task ID is missing');
      return;
    }
    try {
      await deleteDoc(doc(db, 'tasks', task.id));
      dispatch(deleteTask({ id: task.id, section }));
    } catch (error) {
      console.error('Error deleting task:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleTimerToggle = () => {
    if (isRunning) {
      dispatch(pauseTask({ id: task.id, remainingTime: timeLeft }));
    }
    setIsRunning(!isRunning);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
      <Checkbox checked={task.checked} onCheckedChange={handleCheckboxChange} />
      <div className="flex-grow">
        <h3 className="font-semibold">{task.title}</h3>
        <p className="text-sm text-gray-500">{task.description}</p>
      </div>
      <div className="text-lg font-semibold">{formatTime(timeLeft)}</div>
      <Button onClick={handleTimerToggle} variant="outline" size="icon">
        {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <Button onClick={() => setIsEditing(true)} variant="outline" size="icon">
        <Edit className="h-4 w-4" />
      </Button>
      <Button onClick={handleDelete} variant="destructive" size="icon">
        <Trash className="h-4 w-4" />
      </Button>
      <TaskModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        task={task}
      />
    </div>
  );
};

export default TaskItem;
