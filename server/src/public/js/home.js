
let currentDays = 7;

// 載入統計資料
async function loadStats() {
    try {
        // 載入總體統計
        const statsResponse = await fetch('/api/stats');
        const statsData = await statsResponse.json();
        
        // 顯示總訪問次數
        const totalViews = statsData.totalViews || 0;
        document.getElementById('totalViews').textContent = totalViews.toLocaleString('zh-TW')+"次";
        
        // 載入每日統計以取得今日和7日平均
        const dailyResponse = await fetch('/api/daily-stats?days=7');
        const dailyData = await dailyResponse.json();
        
        // 今日訪問 (最新一天的數據)
        const todayViews = dailyData.stats && dailyData.stats.length > 0 
            ? dailyData.stats[dailyData.stats.length - 1].totalViews 
            : 0;
        document.getElementById('todayViews').textContent = todayViews.toLocaleString('zh-TW')+"次";
        
        // 7日平均
        const avgViews = dailyData.stats && dailyData.stats.length > 0
            ? Math.round(dailyData.stats.reduce((sum, day) => sum + day.totalViews, 0) / dailyData.stats.length)
            : 0;
        document.getElementById('avgViews').textContent = avgViews.toLocaleString('zh-TW')+"次";
        
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

// ApexCharts 實例
let chart = null;

// 生成每日趨勢圖表
function generateDailyChart(stats) {
    const dates = stats.map(s => s.date);
    const views = stats.map(s => s.totalViews);
    
    const options = {
        series: [{
            name: '訪問次數',
            data: views
        }],
        chart: {
            type: 'area',
            height: 350,
            toolbar: {
                show: false,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        // fill: {
        //     type: 'gradient',
        //     gradient: {
        //         shadeIntensity: 1,
        //         opacityFrom: 0.7,
        //         opacityTo: 0.3,
        //         stops: [0, 90, 100]
        //     }
        // },
        xaxis: {
            categories: dates,
            labels: {
                style: {
                    colors: '#666',
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            title: {
                text: '訪問次數',
                style: {
                    color: '#666',
                    fontSize: '14px',
                    fontWeight: 600
                }
            },
            labels: {
                formatter: function (value) {
                    return Math.round(value).toLocaleString('zh-TW');
                },
                style: {
                    colors: '#666',
                    fontSize: '12px'
                }
            }
        },
        tooltip: {
            y: {
                formatter: function (value) {
                    return value.toLocaleString('zh-TW') + ' 次';
                }
            },
            theme: 'dark'
        },
        colors: ['#3C91E6'],
        grid: {
            show: true,
            borderColor: '#e0e0e0',
            strokeDashArray: 3,
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        markers: {
            size: 4,
            colors: ['#667eea'],
            strokeColors: '#fff',
            strokeWidth: 2,
            hover: {
                size: 6
            }
        }
    };
    
    // 如果圖表已存在，先銷毀
    if (chart) {
        chart.destroy();
    }
    
    // 創建新圖表
    chart = new ApexCharts(document.querySelector('#dailyChart'), options);
    chart.render();
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
