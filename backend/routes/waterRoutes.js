const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { add, getAll } = require('../controllers/waterController');
const axios = require('axios');

// Поточні роуті
router.post('/', auth, add);
router.get('/', auth, getAll);

// Новий ендпоінт для поради від ШІ
router.post('/advice', auth, async (req, res) => {
  const { waterTodayLiters } = req.body;

  if (!waterTodayLiters) {
    return res.status(400).json({ error: "Вкажіть скільки води випили сьогодні" });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: "system", content: "Ти особистий тренер з пиття води." },
          { role: "user", content: `Сьогодні я випив ${waterTodayLiters} літрів води. Що порадиш?` }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const advice = response.data.choices[0].message.content;
    res.json({ advice });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Помилка при генерації поради" });
  }
});

module.exports = router;
