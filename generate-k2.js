// Простой генератор PNG-заглушки (требует установки: npm install pngjs)
const fs = require('fs')
// Для простоты пока создадим текстовый файл-заглушку
fs.writeFileSync(
  'k2.png',
  Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
    'base64',
  ),
)
console.log('✅ k2.png создан (заглушка 1x1px)')
