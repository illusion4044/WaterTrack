import React, { useEffect, useState } from 'react';
import { addWater, getWaterData } from '../api';
import WaterCalendar from './WaterCalendar';
import AICompanion from './AICompanion';

export default function Dashboard({ user }) {
  const [entries, setEntries] = useState([]);
  const [amount, setAmount] = useState('');
  const [goal] = useState(2000);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getWaterData(user.token);
    if (!res.message) setEntries(res);
  };

  const add = async (e) => {
    e.preventDefault();
    if (!amount) return;
    await addWater(user.token, Number(amount));
    setAmount('');
    fetchData();
  };

  const totalToday = entries
    .filter(e => new Date(e.date).toDateString() === new Date().toDateString())
    .reduce((s, e) => s + e.amount, 0);

  return (
    <div className="card dashboard">
      <h3>Dashboard</h3>

      <div>
        Today: {totalToday} / {goal} ml
        <progress value={totalToday} max={goal}></progress>
      </div>

      <form onSubmit={add}>
        <input
          type="number"
          placeholder="Amount ml"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <button>Add</button>
      </form>

      <WaterCalendar entries={entries} goal={goal} />
      <AICompanion user={user} />
    </div>
  );
}
