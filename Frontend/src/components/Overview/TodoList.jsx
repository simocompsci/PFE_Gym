import React, { useState } from 'react';
import { Check, Plus, X, CheckCircle2 } from 'lucide-react';

// Sample initial tasks for a gym owner
const initialTasks = [
  { id: 1, text: 'Check equipment maintenance', time: '8:30 AM', completed: false },
  { id: 2, text: 'Review new membership applications', time: '10:00 AM', completed: true },
  { id: 3, text: 'Meet with new fitness instructor', time: '1:00 PM', completed: false },
  { id: 4, text: 'Order new protein supplements', time: '3:00 PM', completed: false },
  { id: 5, text: 'Review monthly revenue report', time: '4:30 PM', completed: false },
  { id: 6, text: 'Schedule social media posts', time: '5:15 PM', completed: false },
];

const TodoList = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Toggle task completion
  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Add new task
  const addTask = () => {
    if (newTask.trim() === '') return;

    const task = {
      id: Date.now(),
      text: newTask,
      time: newTaskTime || formatCurrentTime(),
      completed: false
    };

    setTasks([...tasks, task]);
    setNewTask('');
    setNewTaskTime('');
    setIsAdding(false);
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Format current time as HH:MM AM/PM
  const formatCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // We're now using inline onKeyDown handler instead of this function

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 w-full h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-3 tracking-tight flex items-center">
        <CheckCircle2 className="mr-2 text-blue-500" size={20} />
        Today's Tasks
        <span className="ml-auto text-xs text-gray-500 font-medium">
          {tasks.filter(task => task.completed).length}/{tasks.length} completed
        </span>
      </h2>

      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between bg-gray-100 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center flex-1">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center border ${
                    task.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {task.completed && <Check size={14} />}
                </button>
                <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {task.text}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2 bg-gray-200 px-2 py-1 rounded border border-gray-300">{task.time}</span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-200"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center text-gray-500 py-8">No tasks for today.</div>
          )}
        </div>
      </div>

      {isAdding ? (
        <div className="mt-4 flex w-full items-center space-x-2">
          <div className="flex-1">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a new task..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <input
            type="text"
            value={newTaskTime}
            onChange={(e) => setNewTaskTime(e.target.value)}
            placeholder="Time"
            className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTask}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
          >
            Add
          </button>
          <button
            onClick={() => setIsAdding(false)}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          <Plus size={18} className="mr-1" />
          Add Task
        </button>
      )}
    </div>
  );
};

export default TodoList;
