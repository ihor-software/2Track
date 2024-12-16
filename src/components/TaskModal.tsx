import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTaskToday, addTaskTomorrow, updateTask } from '../store/tasksSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, updateDoc, collection } from 'firebase/firestore';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: {
    id: string;
    title: string;
    description: string;
    priority: string;
    section: 'today' | 'tomorrow';
    remainingTime?: number;
    createdAt: number;
    user: string;
    checked?: boolean;
  };
}

export function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'low');
  const [timerMinutes, setTimerMinutes] = useState(task?.remainingTime ? Math.floor(task.remainingTime / 60) : 25);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setTimerMinutes(task.remainingTime ? Math.floor(task.remainingTime / 60) : 25);
    } else {
      setTitle('');
      setDescription('');
      setPriority('low');
      setTimerMinutes(25);
    }
    setError('');
  }, [task, isOpen]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const taskData = {
      title,
      description,
      priority: priority as 'low' | 'medium' | 'high',
      remainingTime: timerMinutes * 60,
      user: auth.currentUser?.uid || '',
      createdAt: task?.createdAt || new Date().getTime(),
      checked: task?.checked || false,
      section: task?.section || 'today' as 'today' | 'tomorrow',
    };

    try {
      if (task?.id) {
        await updateDoc(doc(db, 'tasks', task.id), taskData);
        dispatch(updateTask({ id: task.id, ...taskData }));
      } else {
        const newTaskRef = doc(collection(db, 'tasks'));
        const newTask = { id: newTaskRef.id, ...taskData };
        await setDoc(newTaskRef, newTask);
        if (taskData.section === 'today') {
          dispatch(addTaskToday(newTask));
        } else {
          dispatch(addTaskTomorrow(newTask));
        }
      }
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Failed to save task. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timer" className="text-right">
              Timer (minutes)
            </Label>
            <Input
              id="timer"
              type="number"
              value={timerMinutes}
              onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
              className="col-span-3"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}