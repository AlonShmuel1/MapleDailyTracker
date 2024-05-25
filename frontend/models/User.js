import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  drop: {
    type: [String],
    required: true,
  },
  Mesos: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  missions: [missionSchema],  // Adding missions field
});

export default mongoose.models.User || mongoose.model('User', userSchema, 'Users');
