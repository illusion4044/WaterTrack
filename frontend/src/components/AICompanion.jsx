import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../api';

export default function AICompanion({ user }) {
  const [messages, setMessages] = useState([
    { 
      from: 'ai', 
      text: 'Привіт! Я твій ШІ-компаньйон 💧 Запитай щось про воду або просто поговоримо.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

  // Auto-scroll до низу при нових повідомленнях
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { from: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatWithAI(user.token, userMessage.text);
      
      console.log('✅ AI Response:', res);
      
      setMessages(prev => [
        ...prev,
        { from: 'ai', text: res.advice || '🤖 Не зміг відповісти' }
      ]);
    } catch (err) {
      console.error('❌ AI Error:', err);
      setMessages(prev => [
        ...prev,
        { from: 'ai', text: '❌ Помилка з\'єднання з AI' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      marginTop: '20px',
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
      padding: '15px',
      backgroundColor: 'white'
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>💧 AI Companion</h4>
      
      <div 
        ref={chatBoxRef}
        style={{ 
          maxHeight: '300px', 
          overflowY: 'auto', 
          marginBottom: '10px',
          padding: '10px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px'
        }}
      >
        {messages.map((m, i) => (
          <div 
            key={i} 
            style={{ 
              margin: '8px 0', 
              textAlign: m.from === 'user' ? 'right' : 'left' 
            }}
          >
            <span style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: '12px',
              background: m.from === 'user' ? '#d1e7ff' : '#f0f0f0',
              maxWidth: '80%',
              wordWrap: 'break-word'
            }}>
              {m.text}
            </span>
          </div>
        ))}
        
        {loading && (
          <div style={{ textAlign: 'left' }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: '12px',
              background: '#f0f0f0'
            }}>
              Думаю...
            </span>
          </div>
        )}
      </div>
      
      <form onSubmit={send} style={{ display: 'flex', gap: '5px' }}>
        <input
          placeholder="Напиши повідомлення..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          style={{ 
            flex: 1, 
            padding: '8px', 
            borderRadius: '6px', 
            border: '1px solid #ccc',
            outline: 'none'
          }}
        />
        <button 
          type="submit"
          disabled={loading || !input.trim()} 
          style={{ 
            padding: '8px 16px', 
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.6 : 1,
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white'
          }}
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}