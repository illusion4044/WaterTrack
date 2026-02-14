import React, { useEffect, useState } from 'react';
import { addWater, getWaterData } from '../api.js';
import WaterCalendar from './WaterCalendar';

export default function Dashboard({ user }) {
  const [entries, setEntries] = useState([]);
  const [amount, setAmount] = useState('');
  const [goal, setGoal] = useState(2000);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    const res = await getWaterData(user.token);
    if (res && !res.message) {
      setEntries(res);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    await addWater(user.token, Number(amount));
    setAmount('');
    fetchData();
  };

  // сьогоднішній прогрес
  const totalToday = entries
    .filter(en =>
      new Date(en.date).toDateString() === new Date().toDateString()
    )
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="card dashboard">
      <h3>Dashboard</h3>

      {/* TODAY PROGRESS */}
      <div className="progress-row">
        <div>
          Today: {totalToday} ml / {goal} ml
        </div>
        <progress value={totalToday} max={goal}></progress>
      </div>

      {/* ADD WATER */}
      <form onSubmit={handleAdd} className="add-row">
        <input
          type="number"
          placeholder="Amount ml"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {/* CALENDAR COMPONENT */}
      <WaterCalendar entries={entries} goal={goal} />

      {/* ENTRIES LIST */}
      <ul className="entries">
        {entries.map(e => (
          <li key={e._id}>
            <strong>{e.amount} ml</strong> —{' '}
            <span>{new Date(e.date).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
