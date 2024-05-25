import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/DailyMissionsTracker.module.css';

const DailyMissionsTracker = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchMissions = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/api/missions', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTasks(res.data.missions);
      } catch (error) {
        console.error('Error fetching missions:', error);
      }
    };

    fetchMissions();
  }, []);

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => task._id === taskId ? { ...task, status: !task.status } : task));
  };

  return (
    <div className={styles.container}>
      <h1>Daily Missions Tracker</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Task</th>
            <th className={styles.th}>Drops</th>
            <th className={styles.th}>Mesos</th>
            <th className={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task._id}>
              <td className={styles.td}>{task.taskName}</td>
              <td className={styles.td}>{task.drop.join(', ')}</td>
              <td className={styles.td}>{task.Mesos}</td>
              <td className={styles.td}>
                <input
                  type="checkbox"
                  checked={task.status}
                  onChange={() => toggleTaskStatus(task._id)}
                  className={styles.checkbox}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailyMissionsTracker;
