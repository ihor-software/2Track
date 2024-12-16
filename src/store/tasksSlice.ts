import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  checked: boolean;
  createdAt: number;
  description: string;
  priority: 'low' | 'medium' | 'high';
  section: 'today' | 'tomorrow';
  title: string;
  user: string;
  remainingTime?: number;
}

interface TasksState {
  tasksToday: Task[];
  tasksTomorrow: Task[];
}

const initialState: TasksState = {
  tasksToday: [],
  tasksTomorrow: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasksToday: (state, action: PayloadAction<Task[]>) => {
      state.tasksToday = action.payload;
    },
    setTasksTomorrow: (state, action: PayloadAction<Task[]>) => {
      state.tasksTomorrow = action.payload;
    },
    addTaskToday: (state, action: PayloadAction<Task>) => {
      state.tasksToday.push(action.payload);
    },
    addTaskTomorrow: (state, action: PayloadAction<Task>) => {
      state.tasksTomorrow.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const { section, id } = action.payload;
      const taskList = section === 'today' ? state.tasksToday : state.tasksTomorrow;
      const index = taskList.findIndex(task => task.id === id);
      if (index !== -1) {
        taskList[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<{ id: string, section: 'today' | 'tomorrow' }>) => {
      const { id, section } = action.payload;
      if (section === 'today') {
        state.tasksToday = state.tasksToday.filter(task => task.id !== id);
      } else {
        state.tasksTomorrow = state.tasksTomorrow.filter(task => task.id !== id);
      }
    },
    pauseTask: (state, action: PayloadAction<{ id: string, remainingTime: number }>) => {
      const { id, remainingTime } = action.payload;
      const task = state.tasksToday.find(task => task.id === id) || state.tasksTomorrow.find(task => task.id === id);
      if (task) {
        task.remainingTime = remainingTime;
      }
    },
  },
});

export const { setTasksToday, setTasksTomorrow, addTaskToday, addTaskTomorrow, updateTask, deleteTask, pauseTask } = tasksSlice.actions;

export default tasksSlice.reducer;