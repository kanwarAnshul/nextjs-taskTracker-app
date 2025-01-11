import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    tasks: [                                                                                                                                                                                
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tasks', 
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.users || mongoose.model('users', userSchema);

export default User;
