// api2/index.js
//  Модуль API v2 с визуальным выводом (HTML + JSON)

const express = require('express')

module.exports = function createApi2Router(x = {}) {
  const router = express.Router()
  const version = x.version || '2.0'
  const appName = x.appName || 'Express Heroku Deploy'

  //  Логирование
  router.use((req, res, next) => {
    console.log(` [API v${version}] ${req.method} ${req.path}`)
    next()
  })

  // 
  //  ВИЗУАЛЬНАЯ СТРАНИЦА (для браузера)
  // 
  router.get('/', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title> API v${version} | ${appName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: #333;
    }
    .card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: fadeIn 0.5s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .badge {
      display: inline-block;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    h1 {
      font-size: 28px;
      color: #2d3748;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #718096;
      font-size: 16px;
    }
    .info-grid {
      display: grid;
      gap: 15px;
      margin: 25px 0;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      background: #f7fafc;
      border-radius: 10px;
      border-left: 4px solid #667eea;
    }
    .info-label { color: #4a5568; font-weight: 500; }
    .info-value { color: #2d3748; font-family: monospace; }
    .endpoints {
      margin-top: 25px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }
    .endpoint {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 0;
      font-size: 14px;
    }
    .method {
      background: #667eea;
      color: white;
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 12px;
    }
    .path { color: #4a5568; font-family: monospace; }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #a0aec0;
      font-size: 13px;
    }
    .pulse {
      display: inline-block;
      width: 10px;
      height: 10px;
      background: #48bb78;
      border-radius: 50%;
      margin-right: 8px;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.1); }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge"> API v${version}</span>
      <h1>${appName}</h1>
      <p class="subtitle">Модульное Express-приложение</p>
    </div>

    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Статус</span>
        <span class="info-value"><span class="pulse"></span>Онлайн</span>
      </div>
      <div class="info-item">
        <span class="info-label">Порт</span>
        <span class="info-value">${process.env.PORT || 3336}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Время</span>
        <span class="info-value">${new Date().toLocaleTimeString('ru-RU')}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Дата</span>
        <span class="info-value">${new Date().toLocaleDateString('ru-RU')}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Модуль</span>
        <span class="info-value">api2/index.js</span>
      </div>
    </div>

    <div class="endpoints">
      <p style="color:#4a5568;font-weight:500;margin-bottom:12px;">Доступные эндпоинты:</p>
      <div class="endpoint"><span class="method">GET</span><span class="path">/api/v2/</span><span style="color:#a0aec0"> эта страница</span></div>
      <div class="endpoint"><span class="method">GET</span><span class="path">/api/v2/test</span><span style="color:#a0aec0"> JSON ответ</span></div>
      <div class="endpoint"><span class="method">GET</span><span class="path">/api/v2/status</span><span style="color:#a0aec0"> статус сервера</span></div>
    </div>

    <div class="footer">
       Создано с любовью  Олеся  2026
    </div>
  </div>
</body>
</html>
    `
    res.set('Content-Type', 'text/html; charset=utf-8')
    res.send(html)
  })

  // 
  //  JSON-эндпоинты (для программ и API-клиентов)
  // 

  // Тестовый эндпоинт
  router.get('/test', (req, res) => {
    res.json({
      api: appName,
      version: version,
      message: ' API v2 работает!',
      features: ['modular', 'configurable', 'visual', 'scalable'],
      timestamp: Date.now(),
      uptime: process.uptime()
    })
  })

  // Статус сервера (визуальный + JSON)
  router.get('/status', (req, res) => {
    // Если запрос от браузера  отдаём мини-страницу
    const isBrowser = req.headers.accept?.includes('text/html')
    
    if (isBrowser) {
      const statusHtml = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title> Статус сервера</title>
  <style>
    body { font-family: system-ui; background: #f0fff4; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .box { background: white; padding: 30px 50px; border-radius: 16px; box-shadow: 0 10px 40px rgba(72,187,120,0.3); text-align: center; }
    .ok { color: #48bb78; font-size: 48px; margin-bottom: 15px; }
    h2 { color: #2d3748; margin-bottom: 10px; }
    p { color: #718096; }
    code { background: #edf2f7; padding: 4px 10px; border-radius: 6px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="box">
    <div class="ok"></div>
    <h2>Сервер работает!</h2>
    <p>Время безотказной работы: <code>${Math.floor(process.uptime())} сек</code></p>
    <p style="margin-top:20px;font-size:14px"><a href="/api/v2/" style="color:#667eea;text-decoration:none"> На главную API</a></p>
  </div>
</body>
</html>
      `
      res.set('Content-Type', 'text/html; charset=utf-8')
      return res.send(statusHtml)
    }
    
    // Иначе  чистый JSON
    res.json({
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    })
  })

  return router
}
