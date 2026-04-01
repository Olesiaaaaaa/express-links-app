const fs = require('fs')

// Валидный PNG (1x1 синий пиксель)
const pngBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEklEQVR42mP8z8DwHwYGBgYABQwBB6V8lQkAAAAASUVORK5CYII=',
  'base64',
)

const files = [
  'k2.png',
  'apple-touch-icon.png',
  'favicon-32x32.png',
  'favicon-16x16.png',
]

files.forEach((name) => {
  fs.writeFileSync(name, pngBuffer)
  const size = fs.statSync(name).size
  console.log(`✅ ${name} — ${size} байт`)
})

console.log('\n🎉 Готово! Все картинки созданы.')
