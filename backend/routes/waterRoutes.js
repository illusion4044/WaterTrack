const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { add, getAll } = require('../controllers/waterController');
const axios = require('axios');

// ❌ НЕ ПЕРЕВІРЯЄМО ТУТ - env ще може не завантажитись!
// console.log('🔑 GEMINI_API_KEY loaded:', !!process.env.GEMINI_API_KEY);

// Існуючі роути
router.post('/', auth, add);
router.get('/', auth, getAll);

// AI-компаньйон
router.post('/advice', auth, async (req, res) => {
  // ✅ ПЕРЕВІРЯЄМО ТУТ - коли роут викликається
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('\n🤖 AI Request');
  console.log('API Key exists:', !!apiKey);
  console.log('User:', req.user?.username);
  console.log('Message:', req.body.message);
  
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Потрібне повідомлення" });
  }

  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found!');
    return res.json({ 
      advice: '⚠️ API ключ не налаштовано. Використовую базові відповіді.'
    });
  }

  try {
    // Спробуємо різні моделі
    const models = [
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-2.0-flash-exp'
    ];
    
    let lastError = null;
    
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const prompt = `Ти — AI-компаньйон для трекінгу води з ім'ям "Aqua Buddy" 💧
Відповідай українською мовою, дружньо та коротко (1-3 речення).

Правила:
- Якщо користувач вітається - відповідай дружньо
- Якщо питання про воду - дай пораду
- Якщо користувач ділиться скільки випив - похвали
- Якщо користувач запитує скільки він випив води - відповідай

Повідомлення користувача: "${message}"

Твоя відповідь:`;

        console.log(`🔄 Trying ${model}...`);
        
        const response = await axios.post(url, {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }, {
          timeout: 10000
        });
        
        const advice = response.data.candidates[0].content.parts[0].text;
        
        console.log(`✅ Success with ${model}!`);
        console.log('Response:', advice);
        
        return res.json({ advice });
        
      } catch (err) {
        console.log(`❌ ${model} failed:`, err.response?.status || err.message);
        lastError = err;
        continue;
      }
    }
    
    // Якщо всі моделі не спрацювали - fallback на mock
    throw lastError;

  } catch (err) {
    console.error('❌ All Gemini models failed:', err.message);
    
    // Розумний fallback
    const lowerMessage = message.toLowerCase();
    let mockAdvice = '';

    if (lowerMessage.includes('привіт') || lowerMessage.includes('hi')) {
      mockAdvice = 'Привіт! 👋 Як твоя гідратація сьогодні? Не забувай пити воду регулярно! 💧';
    } else if (lowerMessage.includes('скільки') || lowerMessage.includes('норма')) {
      mockAdvice = 'Рекомендую 2-3 літри води на день. Почни з 8 склянок по 250мл! 💪💧';
    } else if (lowerMessage.match(/\d+\s*(мл|ml|літр)/i)) {
      mockAdvice = 'Чудово! 🎉 Продовжуй у тому ж дусі! Регулярне пиття води - запорука здоров\'я!';
    } else if (lowerMessage.includes('забуваю')) {
      mockAdvice = 'Постав нагадування на телефоні кожні 2 години ⏰ або тримай пляшку води під рукою!';
    } else {
      mockAdvice = 'Пий воду регулярно протягом дня - це важливо для здоров\'я! 💧😊';
    }
    
    console.log('🔄 Using fallback mock:', mockAdvice);
    res.json({ advice: mockAdvice });
  }
});

module.exports = router;