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
    res.status(500).render('error', {
      statusCode: 500,
      title: '伺服器錯誤',
      message: '系統發生錯誤，請稍後再試或聯繫管理員。'
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
    res.status(500).render('error', {
      statusCode: 500,
      title: '伺服器錯誤',
      message: '系統發生錯誤，請稍後再試或聯繫管理員。'
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
    res.status(500).render('error', {
      statusCode: 500,
      title: '伺服器錯誤',
      message: '系統發生錯誤，請稍後再試或聯繫管理員。'
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
















// router.get('/test-operational', (req, res, next) => {
//   const error = new Error('這是可預期的錯誤');
//   error.statusCode = 400;
//   error.isOperational = true;
//   next(error);
// });

// // 測試系統錯誤（不顯示細節）
// router.get('/test-system', (req, res, next) => {
//   const error = new Error('這是系統內部錯誤');
//   error.statusCode = 500;
//   // 沒有設置 isOperational，預設為 false
//   next(error);
// });

// // 測試 async 錯誤
// router.get('/test-async', async (req, res, next) => {
//   try {
//     const player = await Player.findById('invalid_id');
//     res.json(player);
//   } catch (error) {
//     next(error);  // MongoDB 驗證錯誤會被捕捉
//   }
// });







// //連線到royaleapi獲取玩家資料的範例路由
// router.get('/:playerTag', async function (req, res, next) {
//   const playerTag = req.params.playerTag;
//   const validTagPattern = /^[A-Z0-9]{8,}$/i; // 至少 8 個字母或數字
//   if (!validTagPattern.test(playerTag)) {
//     return res.status(404).render('error', {
//       statusCode: 404,
//       title: '無效的玩家標籤',
//       message: '玩家標籤格式不正確，請檢查後再試一次。'
//     });
//   }

//   fetch(`https://api.clashroyale.com/v1/players/%23${encodeURIComponent(req.params.playerTag)}`, {
//     headers: {
//       'Authorization': 'Bearer' + ' ' + process.env.API_KEY
//     }
//   })
//     .then(response => response.json())
//     .then(data => {
//       res.json(data); // 返回玩家資料
//     })
//     .catch(error => {
//       console.error('Error fetching player data:', error);
//       res.status(500).json({ error: 'Failed to fetch player data' });
//     });
// });

module.exports = router;