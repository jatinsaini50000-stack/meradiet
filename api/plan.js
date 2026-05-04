module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { age, weight, goal, region, diet, conditions } = req.body;
  const prompt = `You are MeraDiet AI, a warm Indian nutrition coach. Create a 3-day meal plan for: Age: ${age}, Weight: ${weight}kg, Goal: ${goal}, Region: ${region}, Diet: ${diet}, Conditions: ${conditions || 'none'}. Write in Hindi-English mix with DAY 1, DAY 2, DAY 3 format using Indian portions (roti/katori). Add TIPS and AVOID KARO section.`;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 1200 } })
    });
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Dobara try karein.';
    res.setHeader('Content-Type', 'text/event-stream');
    const words = text.split(' ');
    for (let i = 0; i < words.length; i += 5) {
      res.write(`data: ${JSON.stringify({ text: words.slice(i, i+5).join(' ') + ' ' })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}
