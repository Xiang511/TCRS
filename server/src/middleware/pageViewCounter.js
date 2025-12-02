const PageView = require('../models/PageView');
const DailyStats = require('../models/DailyStats');

/**
 * 頁面訪問計數中間件
 * 記錄每個頁面的訪問次數和每日統計
 */
const pageViewCounter = async (req, res, next) => {
  try {
    // 只記錄 GET 請求的頁面訪問
    if (req.method === 'GET') {
      const path = req.path;
      
      // 排除靜態資源和 API 請求
      if (!path.startsWith('/api/') && 
          !path.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
        
        // 1. 更新總體頁面計數
        await PageView.findOneAndUpdate(
          { path: path },
          { 
            $inc: { count: 1 },
            $set: { lastVisit: new Date() }
          },
          { 
            upsert: true,
            new: true 
          }
        );

        // 2. 更新每日統計
        // 使用 UTC+8 時區計算今天的日期
        const now = new Date();
        const utc8Date = new Date(now.getTime() + (8 * 60 * 60 * 1000));
        const today = utc8Date.toISOString().split('T')[0]; // YYYY-MM-DD
        
        // 先嘗試更新現有路徑的計數
        const updateResult = await DailyStats.findOneAndUpdate(
          { 
            date: today,
            'paths.path': path  // 確保該路徑存在
          },
          { 
            $inc: { 
              totalViews: 1,
              'paths.$.count': 1  // 使用位置運算符 $ 更新匹配的元素
            }
          },
          { new: true }
        );

        // 如果沒有找到匹配的記錄(今天是第一次或該路徑不存在)
        if (!updateResult) {
          await DailyStats.findOneAndUpdate(
            { date: today },
            {
              $inc: { totalViews: 1 },
              $push: { paths: { path: path, count: 1 } }
            },
            { upsert: true, new: true }
          );
        }
      }
    }
  } catch (error) {
    // 記錄錯誤但不影響正常流程
    console.error('頁面訪問計數錯誤:', error);
  }
  
  next();
};

module.exports = pageViewCounter;
