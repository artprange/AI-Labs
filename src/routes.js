const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/generate_startup_idea', async (req, res) => {
  const { user_input } = req.body;
  if (!user_input) {
    return res.status(400).json({ error: 'Missing user input' });
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
      prompt: `Proponha uma ideia inovadora de startup baseada na seguinte entrada: ${user_input}`,
      max_tokens: 150,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const idea = response.data.choices[0].text.trim();
    res.json({ startup_idea: idea });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
