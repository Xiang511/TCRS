const express = require('express');
const Player = require('../models/Player'); // 引入 Player 模型
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// 渲染玩家列表頁面
router.get('/', async function (req, res, next) {
  try {
    const { time } = req.query;
    const filter = {};
    
    // 如果有指定季度,就過濾
    if (time) {
      filter.time = time;
    }

    // 獲取玩家資料並按星星點數排序
    const players = await Player.find(filter).sort({ starPoints: -1 });
    
    // 獲取所有可用的季度(不重複)
    const availableSeasons = await Player.distinct('time');
    availableSeasons.sort().reverse(); // 最新的在前面

    res.render('players', { 
      title: '玩家列表', 
      message: 'success', 
      players: players,
      availableSeasons: availableSeasons,
      currentSeason: time || ''
    });
  } catch (error) {
    console.error('獲取玩家列表失敗:', error);
    res.render('players', { 
      title: '玩家列表', 
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

// 獲取所有可用季度
router.get('/seasons', async function (req, res, next) {
  try {
    const seasons = await Player.distinct('time');
    seasons.sort().reverse();
    res.json({ seasons });
  } catch (error) {
    console.error('獲取季度列表失敗:', error);
    res.status(500).json({ error: '無法獲取季度列表' });
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

      // 儲存玩家資料按照 Player 模型結構
      const playerData = {
        tag: data.tag,
        name: data.name,
        expLevel: data.expLevel,
        wins: data.wins,
        losses: data.losses,
        battleCount: data.battleCount,
        threeCrownWins: data.threeCrownWins,
        challengeCardsWon: data.challengeCardsWon,
        challengeMaxWins: data.challengeMaxWins,
        tournamentCardsWon: data.tournamentCardsWon,
        tournamentBattleCount: data.tournamentBattleCount,
        totalDonations: data.totalDonations,
        leagueStatistics: data.leagueStatistics,
        starPoints: data.starPoints,
        expPoints: data.expPoints,
        lastPathOfLegendSeasonResult: data.lastPathOfLegendSeasonResult,
        bestPathOfLegendSeasonResult: data.bestPathOfLegendSeasonResult,
        totalExpPoints: data.totalExpPoints
      };
      const player = new Player(playerData);
      player.save()
        .then(() => {
          console.log('玩家資料已儲存到資料庫');
        })
        .catch(error => {
          console.error('儲存玩家資料失敗:', error);
        });
    })
    .catch(error => {
      console.error('獲取玩家資料失敗:', error);
      res.status(500).json({ error: '無法獲取玩家資料' });
    });
});

module.exports = router;