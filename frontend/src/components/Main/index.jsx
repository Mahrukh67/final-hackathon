import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import axios from "axios";
import { updateTaskStatus } from '../../taskFunctions.js';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Main = ({ setEditingTask }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const statuses = ['todo', 'doing', 'review'];
  const someVar = true;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // This toggles the menu visibility
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchTasks = async () => {
      try {
        const { data } = await axios.get("http://localhost:4003/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(data);
      } catch (error) {
        console.error("Fetch tasks error:", error.response?.data || error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    };

    fetchTasks();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.reload();
  };

  const handleAddTaskClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setNewTask("");
      setNewDescription("");
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask || !newDescription) {
      setError("Both title and description are required");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4003/api/tasks",
        { title: newTask, description: newDescription, status: "todo" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks((prev) => [...prev, response.data]);
      setNewTask("");
      setNewDescription(""); // clear input
    } catch (error) {
      setError("Error adding task.");
    }
  };

  // const handleStatusUpdate = async (taskId, newStatus) => {
  //   try {
  //     console.log("Updating task:", taskId, "to status:", newStatus);
  //     await updateTaskStatus(taskId, newStatus, token);
  //     setTasks((prevTasks) =>
  //       prevTasks.map((task) =>
  //         task._id === taskId ? { ...task, status: newStatus } : task
  //       ));
  //     console.log("Task status updated successfully");
  //   } catch (error) {
  //     console.error("Error updating task status", error);
  //     alert("Failed to update task. Please try again.");
  //   }
  // };

  const handleStatusUpdate = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:4003/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      setError("Error deleting task.");
    }
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return; // If dropped outside

    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, removed);
    setTasks(reorderedTasks);
  };

  if (!user && isLoggedIn) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className={styles.main_container}>
      <nav className="flex justify-between items-center bg-gray-800 text-white p-4 shadow-lg">
  <h1 className="text-xl font-semibold">App Tracker</h1>
  {user && <div className="text-lg font-medium">Welcome, {user.firstName}</div>}
</nav>

      </div>
  
      <div className="bg-purple-600 p-4 flex justify-between items-center text-white shadow-md rounded-lg">
  <h1 className="text-3xl font-bold">Task Board</h1>
  <button onClick={toggleMenu} className="text-3xl hover:text-purple-200 transition duration-200 ease-in-out">
    ☰
  </button>
</div>

  
      {isMenuOpen && (
        <div className="bg-gray-400 shadow-lg rounded-lg p-2 flex items-start space-y-2">
  {!isLoggedIn ? (
    <>
      <Link to="/signup" className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out">
        Signup
      </Link>
      <Link to="/login" className="bg-purple-600 ml-3 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out">
        Login
      </Link>
    </>
  ) : (
    <button 
      className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out"
      onClick={handleLogout}
    >
      Logout
    </button>
  )}
</div>

      )}
  
      <div className="flex flex-col items-center p-4 bg-purple-100 rounded-xl shadow-md max-w-6xl mx-auto w-full mt-6 mb-6">
        <h2 className="text-3xl font-bold text-purple-800 mb-6">Your Tasks</h2>
  
        {error && <p className="text-red-500 text-center">{error}</p>}
  
        {isLoggedIn && (
          <form
            onSubmit={handleAddTask}
            className="w-full max-w-xl flex flex-col gap-4 items-center mb-6"
          >
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task title"
              required
              className="w-full p-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800"
            />
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Enter task description"
              required
              className="w-full p-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-full transition duration-300 text-lg"
            >
              Add
            </button>
          </form>
        )}
  
        {tasks.length === 0 ? (
          <p className="text-center text-gray-600">No tasks found.</p>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {statuses.map((status) => (
                <Droppable droppableId={status} key={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`rounded-xl p-4 shadow-md min-h-[200px] transition-all ${
                        status === "todo"
                          ? "bg-purple-200"
                          : status === "doing"
                          ? "bg-blue-200"
                          : "bg-yellow-200"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold capitalize text-gray-700">
                          {status}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            status === "todo"
                              ? "bg-purple-500 text-white"
                              : status === "doing"
                              ? "bg-blue-500 text-white"
                              : "bg-yellow-500 text-white"
                          }`}
                        >
                          {tasks.filter((task) => task.status === status).length}
                        </span>
                      </div>
  
                      <ul className="space-y-3">
                        {tasks
                          .filter((task) => task.status === status)
                          .map((task, index) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={index}
                            >
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-white p-4 rounded-lg shadow-sm"
                                >
                                  <div className="font-semibold text-black">
                                    {task.title}
                                  </div>
                                  <div className="text-sm text-gray-700 mt-1">
                                    {task.description}
                                  </div>
                                  <div className="flex gap-3 mt-3 text-sm">
                                    <button
                                      onClick={() => handleStatusUpdate(task._id, "doing")}
                                      className="text-blue-600 hover:underline"
                                    >
                                      Doing
                                    </button>
                                    <button
                                      onClick={() => handleStatusUpdate(task._id, "review")}
                                      className="text-green-600 hover:underline"
                                    >
                                      Done
                                    </button>
                                    <button
                                      onClick={() => deleteTask(task._id)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </li>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </ul>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  );
  
};

export default Main;