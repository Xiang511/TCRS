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

process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！')
  console.error(err);
  process.exit(1);
});
// 未捕捉到的 catch 
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
});




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




// EJS 範例路由
app.get('/', (req, res) => {
  res.render('index', {
    title: 'TCRS Server',
    message: '這是測試首頁!'
  });
});

    

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 錯誤
app.use(function (req, res, next) {
  // 如果是 API 請求，返回 JSON
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({
      status: 'error',
      message: "無此路由資訊",
    });
  }
  // 否則渲染 HTML 錯誤頁面
  res.status(404).render('error', {
    statusCode: 404,
    title: '找不到頁面',
    message: '抱歉，您訪問的頁面不存在或已被移除。'
  });
});

// express 錯誤處理
// 自己設定的 err 錯誤 
const resErrorProd = (err, req, res) => {
  // 如果是 API 請求，返回 JSON
  if (req.originalUrl.startsWith('/api/')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        message: err.message
      });
    } else {
      console.error('出現重大錯誤', err);
      return res.status(500).json({
        status: 'error',
        message: '系統錯誤，請恰系統管理員'
      });
    }
  }
  
  // 否則渲染 HTML 錯誤頁面
  if (err.isOperational) {
    res.status(err.statusCode).render('error', {
      statusCode: err.statusCode,
      title: '系統錯誤',
      message: err.message
    });
  } else {
    console.error('出現重大錯誤', err);
    res.status(500).render('error', {
      statusCode: 500,
      title: '伺服器錯誤',
      message: '系統發生錯誤，請稍後再試或聯繫管理員。'
    });
  }
};
// 開發環境錯誤
const resErrorDev = (err, req, res) => {
  // 如果是 API 請求，返回 JSON
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(err.statusCode).json({
      message: err.message,
      error: err,
      stack: err.stack
    });
  }
  
  // 否則渲染 HTML 錯誤頁面（帶詳細資訊）
  res.status(err.statusCode).render('error', {
    statusCode: err.statusCode,
    title: '開發模式錯誤',
    message: err.message,
    error: err
  });
};
// express 錯誤中介軟體
app.use(function (err, req, res, next) {
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, req, res);
  }
  resErrorProd(err, req, res)
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
