// api/index.js
//  Фабрика роутеров: принимает конфиг (x)  возвращает настроенный Router

const express = require('express')

/**
 * Фабрика создания роутера для API
 * @param {Object} x - Конфигурация: { prefix, protected, logger }
 * @returns {express.Router} Настроенный экземпляр роутера
 */
module.exports = function createApiRouter(x = {}) {
  const router = express.Router()
  
  //  Применяем конфигурацию из аргумента x
  const prefix = x.prefix || ''
  const protected = x.protected || false
  const logger = x.logger || true

  //  Глобальный middleware для этого роутера (если включён логгер)
  if (logger) {
    router.use((req, res, next) => {
      const start = Date.now()
      console.log(` [API${prefix}] ${req.method} ${req.path}`)
      res.on('finish', () => {
        const duration = Date.now() - start
        console.log(` [API${prefix}] Ответ: ${res.statusCode} |  ${duration}ms`)
      })
      next()
    })
  }

  //  Middleware проверки защиты (если включена)
  if (protected) {
    router.use((req, res, next) => {
      if (!req.currentUser) {
        return res.status(401).json({ error: 'Требуется авторизация' })
      }
      next()
    })
  }

  // 
  //  МАРШРУТЫ
  // 

  router.get(`${prefix}/`, (req, res) => {
    res.json({
      message: ` API${prefix || ''} работает!`,
      config: { prefix, protected, logger },
      requestId: req.requestId
    })
  })

  router.get(`${prefix}/user-info`, (req, res) => {
    res.json({
      message: 'Данные из middleware главного приложения',
      user: req.currentUser,
      clientIP: req.clientIP,
      accessGranted: req.accessGranted,
      timestamp: new Date().toISOString()
    })
  })

  router.get(`${prefix}/admin`, (req, res) => {
    res.json({
      message: ' Доступ разрешён!',
      secret: 'Это видит только авторизованный пользователь',
      user: req.currentUser?.name,
      role: req.currentUser?.role
    })
  })

  router.get(`${prefix}/calc/:num`,
    (req, res, next) => {
      const num = parseFloat(req.params.num)
      if (isNaN(num)) {
        return res.status(400).json({ error: 'Параметр должен быть числом' })
      }
      req.calcNum = num
      next()
    },
    (req, res, next) => {
      req.calcResult = {
        input: req.calcNum,
        squared: req.calcNum ** 2,
        doubled: req.calcNum * 2,
        sqrt: Math.sqrt(req.calcNum)
      }
      next()
    },
    (req, res) => {
      res.json({
        module: `api${prefix || ''}`,
        calculation: req.calcResult,
        processedAt: new Date().toISOString()
      })
    }
  )

  return router
}
