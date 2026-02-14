import React from 'react';

export default function WaterCalendar({ entries, goal }) {

  // Групування води по датах
  const grouped = entries.reduce((acc, entry) => {
    const date = new Date(entry.date).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + entry.amount;
    return acc;
  }, {});

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startWeekDay = firstDay.getDay();

  const days = [];

  // порожні клітинки перед першим днем
  for (let i = 0; i < startWeekDay; i++) {
    days.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const key = dateObj.toISOString().split('T')[0];

    const total = grouped[key] || 0;
    const percent = Math.min(Math.round((total / goal) * 100), 100);

    days.push({
      day: d,
      percent
    });
  }

  return (
    <div className="calendar">
      <h4>Water Calendar</h4>

      <div className="calendar-grid">
        {days.map((d, index) => (
          <div
            key={index}
            className="calendar-day"
            style={{
              background: d
                ? `rgba(0, 150, 255, ${d.percent / 100})`
                : 'transparent'
            }}
          >
            {d && (
              <>
                <span className="day-number">{d.day}</span>
                <span className="percent">{d.percent}%</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
