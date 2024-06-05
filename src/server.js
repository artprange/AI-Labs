const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Importe o arquivo de rotas
const routes = require('./routes');

// Use as rotas importadas
app.use('/', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/generate_startup_idea', async (req, res, next) => {
  const { user_input } = req.body;
  if (!user_input) {
    return res.status(400).json({ error: 'Missing user input' });
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-003',
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
    console.error('Error:', error.message); // Adicionando logging detalhado
    next(error);
  }
});

// Manipulador de erros
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

