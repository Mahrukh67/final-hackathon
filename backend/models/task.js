import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: String,
status: {
  type: String,
  enum: ["todo", "doing", "review"],
  default: "todo"
}
});

const Task = mongoose.model('Task', taskSchema);

export default Task;