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

## Render 部署 (前後端分離模式)
`render.yaml` 目前定義 2 個服務：

1. API (tcrs-api)
  - Node Web Service，root: `server`
  - Build: `npm install`
  - Start: `node src/index.js`
  - 健康檢查：`/api/health`
  - 環境變數：`ALLOWED_ORIGINS` 設為前端網址
2. 前端 (tcrs-web)
  - Static Site，root: `client`
  - Build: `npm install && npm run build`
  - Publish: `dist`
  - 環境變數：`VITE_API_BASE=https://(API 網域)/api`

部署步驟：
1. 將專案 push 到 Git
2. Render -> New -> Blueprint Deploy -> 指向 repo
3. 等待兩個服務建置完成
4. 取得前端網址，回到 API 服務環境變數更新 `ALLOWED_ORIGINS`
5. 取得 API 網址 (例如 https://tcrs-api.onrender.com)，回到前端服務更新 `VITE_API_BASE=https://tcrs-api.onrender.com/api` 後重新 deploy

本地對應設定：
前端 `.env.development` 內 `VITE_API_BASE=/api` (透過 Vite proxy)；部署時改成絕對 URL。

TIPS：更新環境變數後需「Manual Deploy」才能套用。
