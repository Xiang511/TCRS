# TCRS Vue3 + Express 專案骨架

## 結構
```
TCRS-Vue/
  server/        # Express API 伺服器
    src/index.js
    package.json
  client/        # Vue3 + Vite 前端
    index.html
    src/
      main.js
      App.vue
    package.json
```

## 安裝與啟動
在 Windows PowerShell：

```powershell
# 安裝後端依賴
cd server
npm install
npm run dev
# 另開新視窗啟動前端
cd ..\client
npm install
npm run dev
```

後端預設埠：3000  
前端 Vite 預設埠：5173 (啟動後會顯示)  
健康檢查 API: http://localhost:3000/api/health

在 `App.vue` 中按按鈕可重新取得後端狀態。

## 環境變數 (選用)
建立 `server/.env`：
```
PORT=3000
```

## 下一步建議
- 新增路由模組化 (e.g. routes/health.js)
- 加入 ESLint / Prettier
- 加入 TypeScript (前後端)
- Docker 化
- 前後端以 proxy (Vite) 免手動寫完整 URL：在 `client/vite.config.js` 加上 dev server proxy。

## Render 部署 (前後端分離：方案 B - 兩個 web 服務)
`render.yaml` 定義：

### 1. API 服務 (tcrs-api)
- 類型：web (Node)
- rootDir：`server`
- build：`npm install`
- start：`node src/index.js`
- 健康檢查：`/api/health`
- 環境變數：
  - `ALLOWED_ORIGINS` = 部署完成後填入前端完整網址 (例: https://tcrs-web.onrender.com)

### 2. 前端服務 (tcrs-web)
- 類型：web (Node) 使用 `serve` 套件提供靜態檔案
- rootDir：`client`
- build：`npm install && npm run build && npm install -D serve`
- start：`npx serve -s dist -l $PORT`
- 環境變數：
  - `VITE_API_BASE` = API 網域 + `/api` (例: https://tcrs-api.onrender.com/api)

### 部署流程
1. Push repo 至 Git 平台
2. Render -> New -> Blueprint Deploy (使用 `render.yaml`)
3. 取得兩個服務的臨時網址
4. 更新 API 服務 `ALLOWED_ORIGINS` 為前端網址，手動 redeploy API
5. 更新 前端服務 `VITE_API_BASE` 為 API 網址 + `/api`，手動 redeploy 前端

### 本地對應
開發期：前端走 Vite proxy (`VITE_API_BASE=/api`)，後端跑在 3000。
部署期：改為絕對 URL，跨網域由 CORS 控制。

### 常見問題排查
| 問題 | 原因 | 解法 |
|------|------|------|
| 前端呼叫 404 | API 路徑少了 `/api` | 確認 `VITE_API_BASE` 最後要含 `/api` |
| CORS 錯誤 | ALLOWED_ORIGINS 未對應 | 設定完整含協定 https://... 並 redeploy |
| 前端仍舊版 | 未觸發重建 | 修改環境變數後 Manual Deploy |
| 502 on first load | API 尚在啟動 | 稍等幾秒重新整理 |

### 快速驗證
部署後：
1. 開啟前端網址 -> 開發者工具 Network -> 呼叫 `/api/health` 是否 200
2. 直接瀏覽器開 API 網址 `/api/health` 確認 JSON

### 後續可加強
- 開啟 gzip / brotli (改用 CDN 或加 Nginx 層)
- 加入監控 (Render Logs + 健康告警)
- 用環境別 (staging / prod) 分開 `VITE_API_BASE` 與 `ALLOWED_ORIGINS`
