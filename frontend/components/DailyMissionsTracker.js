import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/DailyMissionsTracker.module.css';

const DailyMissionsTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ taskName: '', drop: '', Mesos: '' });
  const [showForm, setShowForm] = useState(false);

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

  const toggleTaskStatus = async (taskId) => {
    const updatedTasks = tasks.map(task => task._id === taskId ? { ...task, status: !task.status } : task);
    setTasks(updatedTasks);

    const token = localStorage.getItem('token');
    try {
      await axios.put('/api/missions', { taskId, status: !tasks.find(task => task._id === taskId).status }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error updating mission status:', error);
    }
  };

  const addNewTask = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('/api/missions', newTask, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTasks([...tasks, res.data]);
      setNewTask({ taskName: '', drop: '', Mesos: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding new task:', error);
    }
  };

  return (
    <div className={styles.container}>
      <img src="/logo.png" alt="Daily Missions" className={styles.image} />
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
            <tr key={task._id} className={task.status ? styles.completed : ''}>
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
      <button className={styles.addButton} onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Task'}
      </button>
      {showForm && (
        <form onSubmit={addNewTask} className={styles.form}>
          <input
            type="text"
            value={newTask.taskName}
            onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
            placeholder="Task Name"
            required
            className={styles.input}
          />
          <input
            type="text"
            value={newTask.drop}
            onChange={(e) => setNewTask({ ...newTask, drop: e.target.value })}
            placeholder="Drop"
            required
            className={styles.input}
          />
          <input
            type="text"
            value={newTask.Mesos}
            onChange={(e) => setNewTask({ ...newTask, Mesos: e.target.value })}
            placeholder="Mesos"
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Add Task</button>
        </form>
      )}
    </div>
  );
};

export default DailyMissionsTracker;
