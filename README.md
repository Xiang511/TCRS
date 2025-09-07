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
