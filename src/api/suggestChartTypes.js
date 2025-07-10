import axios from 'axios';
import { CHART_TYPES } from '../constants/chartTypes';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const suggestChartTypes = async (topic) => {
  const allowedTypes = CHART_TYPES.join(', ');

  const prompt = `
You are a data visualization expert.
Your task is to recommend the most appropriate chart types (maximum 3) for the following topic.

Only choose from this list: ${allowedTypes}
Return a plain array of chart types, like: ["Bar", "Line"]

Topic: "${topic}"
`;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You suggest suitable chart types only from a given list.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const content = response.data.choices[0].message.content.trim();
  try {
    return JSON.parse(content).filter((type) => CHART_TYPES.includes(type));
  } catch {
    console.error('Failed to parse chart suggestion:', content);
    return [];
  }
};

export default suggestChartTypes;
