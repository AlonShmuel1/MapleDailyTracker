import jwt from 'jsonwebtoken';
import User from '../../models/User';
import dbConnect from '../../lib/dbConnect';

export default async function handler(req, res) {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  await dbConnect();
  const user = await User.findById(decoded.userId);

  switch (req.method) {
    case 'GET':
      return res.status(200).json({ missions: user.missions });

    case 'POST':
      const { taskName, drop, Mesos } = req.body;
      const newMission = { taskName, drop: drop.split(','), Mesos, status: false };
      user.missions.push(newMission);
      await user.save();
      return res.status(201).json(newMission);

    case 'PUT':
      const { taskId, status } = req.body;
      const mission = user.missions.id(taskId);
      if (mission) {
        mission.status = status;
        await user.save();
        return res.status(200).json({ message: 'Mission status updated' });
      }
      return res.status(404).json({ message: 'Mission not found' });

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
