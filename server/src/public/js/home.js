
let currentDays = 7;

// 載入統計資料
async function loadStats() {
    try {
        // 載入總體統計
        const statsResponse = await fetch('/api/stats');
        const statsData = await statsResponse.json();
        
        // 顯示總訪問次數
        const totalViews = statsData.totalViews || 0;
        document.getElementById('totalViews').textContent = totalViews.toLocaleString('zh-TW');
        
        // 載入每日統計以取得今日和7日平均
        const dailyResponse = await fetch('/api/daily-stats?days=7');
        const dailyData = await dailyResponse.json();
        
        // 今日訪問 (最新一天的數據)
        const todayViews = dailyData.stats && dailyData.stats.length > 0 
            ? dailyData.stats[dailyData.stats.length - 1].totalViews 
            : 0;
        document.getElementById('todayViews').textContent = todayViews.toLocaleString('zh-TW');
        
        // 7日平均
        const avgViews = dailyData.stats && dailyData.stats.length > 0
            ? Math.round(dailyData.stats.reduce((sum, day) => sum + day.totalViews, 0) / dailyData.stats.length)
            : 0;
        document.getElementById('avgViews').textContent = avgViews.toLocaleString('zh-TW');
        
        // 載入圖表
        await loadDailyStats(currentDays);
    } catch (error) {
        console.error('載入統計資料失敗:', error);
        document.getElementById('totalViews').textContent = '0';
        document.getElementById('todayViews').textContent = '0';
        document.getElementById('avgViews').textContent = '0';
    }
}

// 載入每日統計
async function loadDailyStats(days) {
    try {
        const response = await fetch(`/api/daily-stats?days=${days}`);
        const data = await response.json();

        // 生成圖表
        generateDailyChart(data.stats);

    } catch (error) {
        console.error('載入每日統計失敗:', error);
    }
}

// 生成每日趨勢圖表
function generateDailyChart(stats) {
    const dates = stats.map(s => s.date);
    const views = stats.map(s => s.totalViews);
    c3.generate({
        bindto: '#dailyChart',
        data: {
            x: 'x',
            columns: [
                ['x', ...dates],
                ['訪問次數', ...views]
            ],
            type: 'area-spline'
        },
        axis: {
            x: {
                type: 'category',
                tick: {
                    multiline: false
                }
            },
            y: {
                label: {
                    text: '訪問次數',
                    position: 'outer-middle'
                }
            }
        },
        point: {
            r: 4
        },
        color: {
            pattern: ['#667eea']
        },
        area: {
            zerobased: true
        },
        tooltip: {
            format: {
                title: function (d) {
                    return dates[d];
                },
                value: function (value, ratio, id) {
                    return value.toLocaleString('zh-TW');
                }
            }
        },
        grid: {
            y: {
                show: true
            }
        }
    });
}


// 時間範圍切換
document.querySelectorAll('.btn-period').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.btn-period').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentDays = parseInt(this.dataset.days);
        loadDailyStats(currentDays);
    });
});

// 頁面載入完成後執行
window.addEventListener('DOMContentLoaded', loadStats);
