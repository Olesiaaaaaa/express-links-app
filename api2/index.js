// api2/index.js
//  Второй модуль роутеров  например, для версии v2 API

const express = require('express')

module.exports = function createApi2Router(x = {}) {
  const router = express.Router()
  const version = x.version || '2.0'
  
  //  Логирование с указанием версии
  router.use((req, res, next) => {
    console.log(` [API v${version}] ${req.method} ${req.path}`)
    next()
  })

  //  Базовый эндпоинт v2
  router.get('/', (req, res) => {
    res.json({
      api: 'express-heroku-deploy',
      version: version,
      message: ' API v2  новая версия!',
      features: ['modular', 'configurable', 'scalable']
    })
  })

  //  Тестовый эндпоинт
  router.get('/test', (req, res) => {
    res.json({
      status: 'ok',
      module: 'api2',
      config: x,
      timestamp: Date.now()
    })
  })

  return router
}
