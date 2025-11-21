const express = require('express');
const Player = require('../models/Player'); // 引入 Player 模型
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// 渲染玩家列表頁面
router.get('/', async function (req, res, next) {
  try {
    const players = await Player.find(); // 獲取所有玩家
    res.render('players', { title: '玩家列表', message: 'success', players: players });
  } catch (error) {
    console.error('獲取玩家列表失敗:', error);
    res.render('players', { title: '玩家列表', message: 'failed to load players', players: [] });
  }
});

// 從 MongoDB 獲取玩家列表
router.get('/list', async function (req, res, next) {
  try {
    const players = await Player.find(); // 獲取所有玩家
    res.json({ players }); // 返回玩家列表
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