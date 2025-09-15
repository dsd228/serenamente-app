require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Para servir index.html

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Endpoint del chatbot
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  const systemPrompt = `
Eres un chatbot de apoyo emocional basado en psicología, empático y educativo. 
Responde como un psicólogo profesional, usando lenguaje sencillo, ofreciendo apoyo, recomendaciones, recursos y orientación al usuario. 
Puedes sugerir técnicas como respiración, mindfulness, ejercicios cognitivo-conductuales y recomendar recursos validados (explica de dónde sale la información). 
Si detectas riesgo (ideas suicidas, crisis), anima a contactar ayuda profesional o una línea de emergencia.
Puedes guiar paso a paso tests como PHQ-9 (depresión), GAD-7 (ansiedad), o Escala de Estrés Percibido, y dar resultados inmediatos con recomendaciones generales. 
Actúa siempre con empatía y según la mejor evidencia científica.
  `;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 350,
      temperature: 0.7
    });
    const reply = completion.data.choices[0].message.content.trim();
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ reply: 'No pude procesar tu mensaje. Por favor, intenta de nuevo.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor Serenamente corriendo en puerto ${PORT}`));
