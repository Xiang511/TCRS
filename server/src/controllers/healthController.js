export function getHealth(req, res) {
  res.json({ status: 'ok', timestamp: Date.now() });
}
