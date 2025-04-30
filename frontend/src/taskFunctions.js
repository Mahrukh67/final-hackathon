// taskFunctions.js
import axios from 'axios';

export const updateTaskStatus = async (id, newStatus, token) => {
  try {
    const response = await axios.put(
      `http://localhost:4003/api/tasks/${id}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data; // Return the response if needed
  } catch (error) {
    console.error("Error updating task status.", error);
    throw error; // Throw the error so you can handle it in the calling function
  }
};
