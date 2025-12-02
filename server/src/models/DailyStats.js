const mongoose = require('mongoose');

const dailyStatsSchema = new mongoose.Schema({
  date: { 
    type: String, // 格式: YYYY-MM-DD
    required: true,
    unique: true
  },
  totalViews: { 
    type: Number, 
    default: 0 
  },
  uniqueVisitors: {
    type: Number,
    default: 0
  },
  paths: [{
    path: String,
    count: Number
  }]
}, {
  timestamps: true
});

// 索引優化查詢
dailyStatsSchema.index({ date: -1 });

const DailyStats = mongoose.model('DailyStats', dailyStatsSchema);

module.exports = DailyStats;
