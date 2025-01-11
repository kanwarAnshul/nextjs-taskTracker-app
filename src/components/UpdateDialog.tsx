import React, { useState } from "react";

interface UpdateDialogProps {
  isOpen: boolean;
  task: any;
  onUpdate: (updatedTask: any) => void;
  onClose: () => void;
}

const UpdateDialog: React.FC<UpdateDialogProps> = ({
  isOpen,
  task,
  onUpdate,
  onClose,
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [deadline, setDeadline] = useState(task.deadline);
  const [priority, setPriority] = useState(task.priority);

  if (!isOpen) return null; 

  const handleUpdate = () => {
    const updatedTask = {
      ...task,
      title,
      description,
      deadline,
      priority,
    };
    onUpdate(updatedTask);
    onClose(); 
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-slate-900 p-6 rounded-lg w-full max-w-md shadow-lg ">
        <h2 className="text-xl font-bold mb-4">Update Task</h2>
        <div className="mb-4">
          <label className="block font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded bg-slate-700"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border bg-slate-700 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Deadline</label>
          <input
            type="date"
            value={new Date(deadline).toISOString().split("T")[0]}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 border rounded bg-slate-700"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium " >Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 border rounded bg-slate-700"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={()=>{handleUpdate()}}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateDialog;
