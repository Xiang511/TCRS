import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import healthRoutes from './routes/healthRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
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
