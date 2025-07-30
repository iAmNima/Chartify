import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const generateChartData = async (topic, chartTypes = []) => {
  const systemPrompt = `
You are a chart-generating assistant.

Your job is to convert a topic into realistic chart data based on the selected chart types.

Return ONLY JSON like this:
[
  {
    "type": "Bar",
    "title": "Average Temperature by Month", // the title concisely describes what the chart shows
    "xLabel": "X Axis Label",
    "yLabel": "Y Axis Label",
    "data": [ { "label": "A", "value": 123 }, ... ]
  },
  ...
]

Instructions per chart type:
- Bar: categories on x-axis, values on y-axis
- Line: time series trend, x = date (YYYY-MM-DD), y = value
- Pie: parts of a whole (label/value) summing to ~100%
- Donut: same as Pie
- Area: same as Line but cumulative feeling
- Scatter: x and y numeric points, optional labels
- Histogram: array of buckets with count per bucket
- Bubble: x, y, size, label
- Radar: label/axis with multiple metrics per category
- Heatmap: rows and columns with intensity values
- Box: label with stats (min, q1, median, q3, max)
- Stacked Bar: categories stacked by subgroups
- Treemap: hierarchical values (name/value or nested children)
- Sunburst: like Treemap but radial
- Gauge: single numeric value (0–100%)
- Timeline: array of events with date, label, and event name

Rules:
- One chart object per type
- Use realistic sample values
- Provide a short title that clearly describes what the chart is showing
- No explanation or markdown — JSON array only

Topic: "${topic}"
Chart types: ${chartTypes.join(', ')}
`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: topic }
        ],
        temperature: 0.7,
        max_tokens: 1200
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const raw = response.data.choices[0].message.content;
    const jsonMatch = raw.match(/\[.*\]/s);
    if (!jsonMatch) throw new Error('No JSON array found in response.');

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('OpenAI API Error:', err);
    throw new Error('Failed to generate chart data.');
  }
};

export default generateChartData;
