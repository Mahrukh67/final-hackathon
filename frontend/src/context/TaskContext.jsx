import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4003/api/tasks')
      .then((response) => setTasks(response.data))
      .catch((error) => console.error(error));
  }, []);

  const addTask = async (task) => {
    try {
      const response = await axios.post('http://localhost:4003/api/tasks', task);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const moveTask = (taskId, newStatus) => {
    setTasks(prevTasks => {
      return prevTasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task
      );
    });
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  );
};
