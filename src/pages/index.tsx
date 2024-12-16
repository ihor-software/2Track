import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth, provider, db } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { setUser, clearUser } from '../store/userSlice';
import { setTasksToday, setTasksTomorrow } from '../store/tasksSlice';
import TaskList from '../components/TaskList';
import AddTaskButton from '../components/AddTaskButton';
import { Button } from '../components/ui/button';
import { RootState } from '../store/store';
import type { Task } from '../store/tasksSlice';

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const tasksToday = useSelector((state: RootState) => state.tasks.tasksToday);
  const tasksTomorrow = useSelector((state: RootState) => state.tasks.tasksTomorrow);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }));
        loadUserTasks(user.uid);
      } else {
        dispatch(clearUser());
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const loadUserTasks = async (uid: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const todayQuery = query(collection(db, 'tasks'), where('section', '==', 'today'), where('user', '==', uid));
      const tomorrowQuery = query(collection(db, 'tasks'), where('section', '==', 'tomorrow'), where('user', '==', uid));

      const [todaySnapshot, tomorrowSnapshot] = await Promise.all([
        getDocs(todayQuery),
        getDocs(tomorrowQuery)
      ]);

      const tasksToday = todaySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Task);
      const tasksTomorrow = tomorrowSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Task);

      dispatch(setTasksToday(tasksToday));
      dispatch(setTasksTomorrow(tasksTomorrow));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User signed in:', result.user);
      setError(null);
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
        const errorMessage = 'Unauthorized domain. Please contact the administrator.';
        console.error(errorMessage);
        setError(errorMessage);
      } else {
        console.error('Error during sign-in:', error);
        setError('An error occurred during sign-in. Please try again.');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
    } catch (error) {
      console.error('Error during sign-out:', error);
      setError('An error occurred during sign-out. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-16">
        <h1 className="text-3xl font-bold">2Track Productivity Service</h1>
        {user.uid ? (
          <div className="flex items-center space-x-4">
            <span>Signed in as {user.displayName}</span>
            <Button onClick={handleSignOut} size="sm">Sign out</Button>
          </div>
        ) : (
          <Button onClick={handleSignIn} size="sm">Sign in with Google</Button>
        )}
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {user.uid ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Today's Tasks</h2>
            <TaskList tasks={tasksToday} section="today" />
            <AddTaskButton section="today" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Tomorrow's Tasks</h2>
            <TaskList tasks={tasksTomorrow} section="tomorrow" />
            <AddTaskButton section="tomorrow" />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Please sign in to view and manage your tasks.</p>
      )}
    </div>
  );
}