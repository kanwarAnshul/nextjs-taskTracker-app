import mongoose from 'mongoose'

const userTaskSchema = new mongoose.Schema(
  {
    taskId: { type: String, required: true,unique:true },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      default: new Date(), 
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'], 
      default: 'medium', 
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    status: {
      pending: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'tasks',
        },
      ],
      ongoing: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'tasks',
        },
      ],
      completed: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'tasks',
        },
      ],
    },
    currentStatus: {
      type: String,
      enum: ['pending', 'ongoing', 'completed'],
      default: 'pending',
    },
  },

  {
    timestamps: true,
  },
)

const Task = mongoose.models.tasks || mongoose.model('tasks', userTaskSchema)

export default Task
