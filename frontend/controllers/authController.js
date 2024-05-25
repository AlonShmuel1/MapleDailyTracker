import User from '../models/User';
import jwt from 'jsonwebtoken';
import dbConnect from '../lib/dbConnect';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
  await dbConnect();
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultMissions = [
      { taskName: 'Zakum', drop: ['arcane symbol'], Mesos: '13,000,000', status: false },
      // Add more default missions if needed
    ];
    const newUser = new User({ email, password: hashedPassword, missions: defaultMissions });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  await dbConnect();
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
