import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const getRandomQuestion = async () => {
  const prompt = 'Provide one short, interesting data analysis question that a user might ask about the world. Respond with the question only.';

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You generate creative, concise data-related questions.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 50,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const content = response.data.choices[0].message.content.trim();
  return content.replace(/^"|"$/g, '');
};

export default getRandomQuestion;
