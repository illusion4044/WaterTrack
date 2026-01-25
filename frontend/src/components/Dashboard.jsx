import React, { useEffect, useState } from 'react';
import { addWater, getWaterData } from '../api.js';

export default function Dashboard({ user }) {
  const [entries, setEntries] = useState([]);
  const [amount, setAmount] = useState('');
  const [goal, setGoal] = useState(2000);

  useEffect(() => {
    if (!user) return;
    getWaterData(user.token).then(res => {
      if (res && !res.message) setEntries(res);
    });
  }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!amount) return;
    await addWater(user.token, Number(amount));
    setAmount('');
    const res = await getWaterData(user.token);
    if (!res.message) setEntries(res);
  };

  const totalToday = entries
    .filter(en => new Date(en.date).toDateString() === new Date().toDateString())
    .reduce((s, e) => s + e.amount, 0);

  return (
    <div className="card dashboard">
      <h3>Dashboard</h3>
      <div className="progress-row">
        <div>Today: {totalToday} ml / {goal} ml</div>
        <progress value={totalToday} max={goal}></progress>
      </div>

      <form onSubmit={handleAdd} className="add-row">
        <input type="number" placeholder="Amount ml" value={amount} onChange={e => setAmount(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <ul className="entries">
        {entries.map(e => (
          <li key={e._id}>
            <strong>{e.amount} ml</strong> — <span>{new Date(e.date).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
