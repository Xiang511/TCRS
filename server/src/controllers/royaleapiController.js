export async function getRoyaleapi(req, res) {
  try {
    const token = process.env.ROYALE_API_TOKEN;
    if (!token) {
      return res.status(500).json({ error: 'Missing ROYALE_API_TOKEN' });
    }

    const rawTag = req.params.tag || req.query.tag || '22R920J00';
    const tag = rawTag.startsWith('#') ? rawTag : `#${rawTag}`;
    const url = `https://api.clashroyale.com/v1/players/${encodeURIComponent(tag)}`;

    // 需要 Node 18+ 內建 fetch；若本機 <18，請安裝 node-fetch 並改為 import fetch from 'node-fetch'
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return res.status(response.status).json({
        error: 'Clash Royale API error',
        status: response.status,
        statusText: response.statusText,
        details: text,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error('Royale API fetch failed:', err);
    return res.status(500).json({ error: 'Server Error' });
  }
}
