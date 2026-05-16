import express from 'express';

const app = express();
const PORT = 80;

const rateLimit = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 10;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    rateLimit.set(ip, { start: now, count: 1 });
    return true;
  }
  entry.count++;
  if (entry.count > RATE_MAX) return false;
  return true;
}

app.use(express.static('/app/dist'));
app.use(express.json());

app.get('/api/ebay/config', (req, res) => {
  res.json({ configured: !!process.env.EBAY_CLIENT_ID });
});

app.get('/api/rawg/:path(*)', async (req, res) => {
  try {
    const key = req.query.key;
    if (!key) return res.status(400).json({ error: 'Clé API requise' });
    const path = req.params.path;
    const qs = Object.entries(req.query)
      .filter(([k]) => k !== 'key')
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
    const url = `https://api.rawg.io/api/${path}?key=${key}${qs ? '&' + qs : ''}`;
    const r = await fetch(url);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/ebay/price', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  if (!checkRateLimit(ip)) return res.status(429).json({ error: 'Trop de requêtes, réessaie dans 1 minute' });
  try {
    const { q, cid, cs } = req.body;
    if (!q) return res.status(400).json({ error: 'Missing q' });
    const clientId = cid || process.env.EBAY_CLIENT_ID;
    const clientSecret = cs || process.env.EBAY_CLIENT_SECRET;
    if (!clientId || !clientSecret) return res.json({ error: 'eBay non configuré. Renseigne les clés dans les paramètres de l\'app.' });

    const tok = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
      },
      body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope'
    });
    const tokData = await tok.json();
    if (!tokData.access_token) return res.status(500).json({ error: 'Échec authentification eBay' });

    const sr = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(q)}&limit=20&filter=buyingOptions:{FIXED_PRICE}`,
      {
        headers: {
          Authorization: 'Bearer ' + tokData.access_token,
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_FR'
        }
      }
    );
    const data = await sr.json();
    const items = data.itemSummaries || [];
    const prices = items.map(i => ({
      title: i.title,
      price: parseFloat(i.price?.value),
      currency: i.price?.currency,
      url: i.itemWebUrl,
      condition: i.condition
    })).filter(i => i.price > 0);

    if (!prices.length) return res.json({ error: 'Aucune annonce trouvée sur eBay FR' });

    const vals = prices.map(p => p.price);
    res.json({
      min: Math.min(...vals),
      max: Math.max(...vals),
      avg: +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2),
      count: vals.length,
      currency: prices[0].currency,
      items: prices
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile('/app/dist/index.html');
});

app.listen(PORT, () => console.log('Server running on port ' + PORT));
