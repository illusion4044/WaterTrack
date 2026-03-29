import React, { useState } from 'react';
import { register } from '../api.js';

export default function Register({ onRegister }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 4) {
      setError('Пароль має бути не менше 4 символів');
      return;
    }
    setError('');
    const data = await register(form);
    onRegister(data);
  };

  return (
    <form className="card" onSubmit={submit}>
      <h3>Register</h3>
      <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
      <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Sign up</button>
    </form>
  );
}
