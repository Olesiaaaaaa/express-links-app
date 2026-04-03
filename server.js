// server.js  МОДУЛЬНАЯ АРХИТЕКТУРА: настройка + импорт модулей 

const express = require('express')
const path = require('path')

//  Импорт фабрик роутеров из модулей
const createApiRouter = require('./api/index.js')
const createApi2Router = require('./api2/index.js')

const app = express()
const PORT = process.env.PORT || 3336
const PUBLIC_DIR = path.join(__dirname, 'public')

// 
//  Глобальные парсеры и базовые middleware
// 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//  Глобальный middleware: метаданные запроса (доступны во всех роутерах!)
app.use((req, res, next) => {
  req.requestId = Date.now()
  req.startTime = Date.now()
  req.clientIP = req.ip || req.connection?.remoteAddress || 'unknown'
  
  //  Передаём данные пользователя (пример для демо)
  req.currentUser = { id: 1, name: 'Олеся', role: 'admin' }
  
  console.log(`\n [${req.requestId}] ${req.method} ${req.url} от ${req.clientIP}`)
  next()
})

// 
//  ПОДКЛЮЧЕНИЕ МОДУЛЬНЫХ РОУТЕРОВ
// 

//  Модуль api: базовая конфигурация
const apiRouter = createApiRouter({
  prefix: '',              // Маршруты: /, /user-info, /admin...
  protected: false,        // Не требовать авторизацию для демо
  logger: true             // Включить логирование
})
app.use('/api', apiRouter) // Все маршруты будут с префиксом /api

//  Модуль api: защищённая версия (для примера)
const apiProtectedRouter = createApiRouter({
  prefix: '/secure',       // Маршруты: /api/secure/...
  protected: true,         //  Требовать авторизацию
  logger: true
})
app.use('/api', apiProtectedRouter)

//  Модуль api2: версия 2.0
const api2Router = createApi2Router({
  version: '2.0'
})
app.use('/api/v2', api2Router) // Маршруты: /api/v2/, /api/v2/test

// 
//  Статика и обработка 404
// 
app.use(express.static(PUBLIC_DIR))

app.use((req, res) => {
  console.warn(` [${req.requestId}] 404: ${req.url}`)
  res.status(404).send(` Страница не найдена: ${req.url}`)
})

// 
//  Глобальный обработчик ошибок
// 
app.use((err, req, res, next) => {
  console.error(` [${req.requestId}] Ошибка:`, err.message)
  res.status(500).json({ 
    error: 'Внутренняя ошибка', 
    message: err.message,
    requestId: req.requestId 
  })
})

// 
//  Запуск сервера
// 
app.listen(PORT, () => {
  console.log(`\n Сервер: http://localhost:${PORT}`)
  console.log(` Статика: ${PUBLIC_DIR}`)
  console.log(` Главная: http://localhost:${PORT}/`)
  console.log(` API v1:  http://localhost:${PORT}/api`)
  console.log(` API v2:  http://localhost:${PORT}/api/v2`)
  console.log(` Тесты:\n   - /api/user-info\n   - /api/calc/7\n   - /api/v2/test\n`)
})
