export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { age, weight, goal, region, diet, conditions } = req.body;

  const prompt = `You are MeraDiet AI, a warm and knowledgeable Indian nutrition coach. Create a practical 3-day meal plan for this person:

- Age: ${age} years
- Weight: ${weight} kg  
- Health goal: ${goal}
- Region: ${region}
- Diet type: ${diet}
- Medical conditions: ${conditions || 'none mentioned'}

Format your response EXACTLY like this (plain text, no markdown symbols):

DAY 1
Subah (7 baje): [drink/detox water with benefits]
Nashta (9 baje): [breakfast with exact portion in roti/katori count]
Dopahar (1 baje): [lunch with portions]
Shaam ka snack (5 baje): [healthy Indian snack]
Raat ka khana (8 baje): [dinner with portions]

DAY 2
[same format]

DAY 3
[same format]

AAPKE GOAL KE LIYE KHAAS TIPS
1. [specific tip for their condition/goal]
2. [specific tip]  
3. [specific tip]
4. [specific tip]

AVOID KARO
- [food to avoid for their specific condition]
- [another food to avoid]
- [another]

Keep meals realistic, affordable, and use common Indian ingredients available in their region. Use Indian measures (katori = 1 cup, chawal ki katori, dal ki katori). Be warm, encouraging and specific. Write in simple Hindi-English mix that feels natural.`;

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1200, temperature: 0.7 }
      })
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (!data || data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              res.write(`data: ${JSON.stringify({ text })}\n\n`);
            }
          } catch (e) {}
        }
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    res.status(500).json({ error: 'AI service error' });
  }
}
