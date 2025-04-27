import styles from "./styles.module.css";
import { Link, useNavigate } from "react-router-dom";
// import { BACKEND_URL } from "../utils/utils";
import React, { useState } from "react";

// import axios from "axios";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";
// import toast from "react-hot-toast";

const Main = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.reload();
  };

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      navigate("/login");
    }
  };

  const handleAddTaskClick = () => {
    const newTask = { id: Date.now(), name: "New Task" };
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <div className={styles.main_container}>
        <nav className={styles.navbar}>
          <h1>App Tracker</h1>
         
        </nav>
      </div>

      {/* Task Board Header */}
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
            <button className={styles.white_btn} onClick={handleLogout}>
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
            <span className="bg-purple-500 text-white rounded-full px-2">{tasks.length}</span>
          </div>
          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-3 rounded shadow">
                {task.name}
              </div>
            ))}
          </div>
          <button onClick={handleAddTaskClick} className="mt-4 text-purple-600">Add Task</button>
        </div>

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
};

export default Main;
