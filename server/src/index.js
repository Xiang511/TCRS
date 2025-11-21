var express = require('express');
var cors = require('cors');
var morgan = require('morgan');
var dotenv = require('dotenv');
var path = require('path');
const mongoose = require('mongoose');

var playersRouter = require('./routes/players');

dotenv.config({ path: './config.env' });
const app = express();
const PORT = process.env.PORT || 3000;


// 設定 EJS 模板引擎
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/javascripts', express.static(path.join(__dirname, 'javascripts')));
app.set('view engine', 'ejs'); // 設置 EJS 為視圖引擎

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 設置 strictQuery 選項
mongoose.set('strictQuery', true);
const DB = process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASSWORD); //連接資料庫


// 連接資料庫
mongoose.connect(DB)
    .then(() => {
        console.log('資料庫連線成功')
                console.log('資料庫名稱:', mongoose.connection.name);
        console.log('資料庫主機:', mongoose.connection.host);
    })
    .catch((error) => {
        console.log(error);
    });


app.use('/players', playersRouter);


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
