import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import healthRoutes from './routes/healthRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

// Middlewares
if (ALLOWED_ORIGINS.length > 0) {
  app.use(cors({ origin: ALLOWED_ORIGINS }));
  console.log('CORS 限制來源: ', ALLOWED_ORIGINS.join(', '));
} else {
  app.use(cors()); // 開發環境預設開放
  console.log('CORS 開放全部 (未設定 ALLOWED_ORIGINS)');
}
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api', healthRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Server Error' });
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
