const express = require('express');
const Player = require('../models/Player'); // 引入 Player 模型
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// 渲染玩家列表頁面
router.get('/', async function (req, res, next) {
  try {
    let { time } = req.query;
    
    // 獲取所有可用的季度(不重複)
    const availableSeasons = await Player.distinct('time');
    availableSeasons.sort().reverse(); // 最新的在前面
    
    // 如果沒有指定季度且有可用季度,預設顯示最新季度
    if (!time && availableSeasons.length > 0) {
      time = availableSeasons[0];
    }
    
    const filter = {};
    if (time) {
      filter.time = time;
    }

    // 獲取玩家資料並按星星點數排序
    const players = await Player.find(filter).sort({ starPoints: -1 });

    res.render('players', { 
      title: '生涯資料排行榜', 
      message: 'success', 
      players: players,
      availableSeasons: availableSeasons,
      currentSeason: time || ''
    });
  } catch (error) {
    console.error('獲取玩家列表失敗:', error);
    res.render('players', { 
      title: '生涯資料排行榜', 
      message: 'failed to load players', 
      players: [],
      availableSeasons: [],
      currentSeason: ''
    });
  }
});

router.get('/leaderboard', async function (req, res, next) {
  try {
    let { time } = req.query;
    
    // 獲取所有可用的季度(不重複)
    const availableSeasons = await Player.distinct('time');
    availableSeasons.sort().reverse(); // 最新的在前面
    
    // 如果沒有指定季度且有可用季度,預設顯示最新季度
    if (!time && availableSeasons.length > 0) {
      time = availableSeasons[0];
    }
    
    const filter = {};
    if (time) {
      filter.time = time;
    }

    // 獲取玩家資料並按星星點數排序
    const players = await Player.find(filter);

    res.render('leaderboard', { 
      title: '天梯賽季排行榜', 
      message: 'success', 
      players: players,
      availableSeasons: availableSeasons,
      currentSeason: time || ''
    });
  } catch (error) {
    console.error('獲取天梯列表失敗:', error);
    res.render('leaderboard', { 
      title: '獲取天梯列表失敗', 
      message: 'failed to load players', 
      players: [],
      availableSeasons: [],
      currentSeason: ''
    });
  }
});

router.get('/badges', async function (req, res, next) {
  try {
    let { time } = req.query;
    
    // 獲取所有可用的季度(不重複)
    const availableSeasons = await Player.distinct('time');
    availableSeasons.sort().reverse(); // 最新的在前面
    
    // 如果沒有指定季度且有可用季度,預設顯示最新季度
    if (!time && availableSeasons.length > 0) {
      time = availableSeasons[0];
    }
    
    const filter = {};
    if (time) {
      filter.time = time;
    }

    // 獲取玩家資料並按星星點數排序
    const players = await Player.find(filter);

    res.render('badges', { 
      title: '徽章進度排行榜', 
      message: 'success', 
      players: players,
      availableSeasons: availableSeasons,
      currentSeason: time || ''
    });
  } catch (error) {
    console.error('獲取徽章進度排行榜失敗:', error);
    res.render('badges', { 
      title: '獲取徽章進度排行榜失敗', 
      message: 'failed to load players', 
      players: [],
      availableSeasons: [],
      currentSeason: ''
    });
  }
});


// 從 MongoDB 獲取玩家列表 (JSON API)
router.get('/list', async function (req, res, next) {
  try {
    const { time } = req.query;
    const filter = {};
    
    if (time) {
      filter.time = time;
    }

    const players = await Player.find(filter).sort({ starPoints: -1 });
    res.json({ players });
  } catch (error) {
    console.error('獲取玩家列表失敗:', error);
    res.status(500).json({ error: '無法獲取玩家列表' });
  }
});










//連線到royaleapi獲取玩家資料的範例路由
router.get('/:playerTag', async function (req, res, next) {
  fetch(`https://api.clashroyale.com/v1/players/%23${encodeURIComponent(req.params.playerTag)}`, {
    headers: {
      'Authorization': 'Bearer' + ' ' + process.env.API_KEY
    }
  })
    .then(response => response.json())
    .then(data => {
      res.json(data); // 返回玩家資料
    })
    .catch(error => {
      console.error('Error fetching player data:', error);
      res.status(500).json({ error: 'Failed to fetch player data' });
    });
});

module.exports = router;