import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.ts';  
import tasksReducer from './tasksSlice.ts';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: tasksReducer,
  },
});