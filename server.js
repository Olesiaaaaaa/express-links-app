// server.js
const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = 3336
const PUBLIC_DIR = path.join(__dirname, 'public')
// 🔹 Middleware: логирование запросов
app.use((req, res, next) => {
  const logEntry = `${new Date().toISOString()} - ${req.method} ${req.url}\n`
  const logPath = path.join(__dirname, 'request.log')

  console.log(`📥 ${req.method} ${req.url}`)

  // Асинхронная запись лога без блокировки
  fs.appendFile(logPath, logEntry, (err) => {
    if (err) console.error('❌ Ошибка записи в лог:', err.message)
  })

  next()
})

// 🔹 API-маршрут: возвращаем корректный JSON
app.get('/', (req, res) => {
  res.json({ Привет: 'мир!' }) // ✅ автоматически ставит Content-Type: application/json
})

// 🔹 Раздача статики (после API-маршрутов, но до 404)
app.use(express.static(PUBLIC_DIR, { index: 'index.html' }))

// 🔹 Спец-обработчик для CSS без расширения (если всё ещё нужен)
app.use('/css/board4_d86af', (req, res, next) => {
  res.setHeader('Content-Type', 'text/css; charset=utf-8')
  next()
})

// 🔹 Обработка 404 — всегда в конце
app.use((req, res) => {
  res.status(404).send(`⚠️ Файл не найден: ${req.url}`)
})

// 🔹 Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`)
  console.log(`📁 Статика: ${PUBLIC_DIR}`)
  console.log(`🔗 API: http://localhost:${PORT}/ → {"Привет":"мир!"}`)
})
