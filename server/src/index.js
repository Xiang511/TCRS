import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 設定 EJS 模板引擎
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// EJS 範例路由
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'TCRS Server',
    message: '歡迎使用 EJS 模板引擎'
  });
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
