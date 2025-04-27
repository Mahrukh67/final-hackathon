import { Link, useNavigate } from "react-router-dom"; // yahan saath me hi import karlo
import { BACKEND_URL } from "../utils/utils";
import React, { useEffect, useState } from "react";

import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from "react-hot-toast";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
   // Define toggleMenu function here
   const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const navigate = useNavigate(); 
  
  const [tasks, setTasks] = useState([]);
   // Define the handleAddTaskClick function
   const handleAddTaskClick = () => {
    // Logic to handle the task addition
    const newTask = "New Task";  // Example of a task, you can customize
    setTasks([...tasks, newTask]);  // Adds the new task to the list
  };
      const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    // token
    useEffect(() => {
      const user = localStorage.getItem("user");
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }, []);
  
    // fetch 
    // useEffect(() => {
    //   const fetchTask = async () => {
    //     try {
    //       const response = await axios.get(`${BACKEND_URL}/task/tasks`, {
    //         withCredentials: true,
    //       });
    //       console.log(response.data.courses);
    //       setCourses(response.data.courses);
    //     } catch (error) {
    //       console.log("error in fetchCourses ", error);
    //     }
    //   };
    //   fetchCourses();
    // }, []);
  
    // logout
    const handleLogout = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/logout`, {
          withCredentials: true,
        });
        toast.success(response.data.message);
        localStorage.removeItem("user");
        setIsLoggedIn(false);
      } catch (error) {
        console.log("Error in logging out ", error);
        toast.error(error.response.data.errors || "Error in logging out");
      }
     
  

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
    setIsMenuOpen(false);
  };
   // Define the toggleMenu function here
  

   // Define the handleAddTaskClick function
   const handleAddTaskClick = () => {
    // Add task logic here, for example:
    const newTask = { id: tasks.length + 1, name: `Task ${tasks.length + 1}` };
    setTasks([...tasks, newTask]);
  };
};
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <div className="bg-purple-600 p-4 flex justify-between items-center text-white">
        <h1 className="text-2xl font-bold">Task Board</h1>
        <button onClick={toggleMenu} className="text-3xl">☰</button>
      </div>

      {/* Navbar */}
      {isMenuOpen && (
        <div className="bg-white shadow-md p-4 flex flex-col items-start">
          {!isLoggedIn ? (
            <>
              <Link to="/signup" className="py-2">Signup</Link>
              <Link to="/login" className="py-2">Login</Link>
            </>
          ) : (
            <button onClick={handleLoginLogout} className="py-2 text-red-500">
              Logout
            </button>
          )}
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* To Do */}
        <div className="bg-purple-200 rounded-lg p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">To Do</h2>
            <span className="bg-purple-500 text-white rounded-full px-2">2</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-white p-3 rounded shadow">Assign tasks to team members</div>
            <div className="bg-white p-3 rounded shadow">Drag tasks from section to section</div>
          </div>
          <button onClick={handleAddTaskClick}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>        </div>

        {/* Doing */}
        <div className="bg-blue-200 rounded-lg p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Doing</h2>
            <span className="bg-blue-500 text-white rounded-full px-2">0/10</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center text-blue-600">
            <div className="text-5xl mb-2">✔️</div>
            <p>No Tasks</p>
            <p className="text-sm mt-2">Limit tasks to stay focused.</p>
          </div>
          <button className="mt-4 text-2xl text-blue-600">+</button>
        </div>

        {/* Review */}
        <div className="bg-yellow-200 rounded-lg p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Review</h2>
            <span className="bg-yellow-500 text-white rounded-full px-2">2</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-white p-3 rounded shadow">Sections provide structure</div>
            <div className="bg-white p-3 rounded shadow">Adapt sections to workflows</div>
          </div>
          <button className="mt-4 text-2xl text-yellow-600">+</button>
        </div>
      </div>
    </div>
  );
}
