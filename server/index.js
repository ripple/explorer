require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const path = require('path')
const xrpl = require('./lib/xrpl-ws')
const routes = require('./routes/v1')

const log = require('./lib/logger')({ name: 'server' })

const PORT = process.env.PORT || 5001
const ADDR = process.env.ADDR || 'localhost'
const app = express()
const cacheBustRegExp = new RegExp('\\.[0-9a-f]{20}\\.')
const files = express.static(path.join(__dirname, '/../build'), {
  etag: true, // Just being explicit about the default.
  lastModified: true, // Just being explicit about the default.
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      // All the project's HTML files end in .html
      res.setHeader('Cache-Control', 'no-cache')
    } else if (cacheBustRegExp.test(filePath)) {
      // If the RegExp matched, then we have a versioned URL.
      res.setHeader('Cache-Control', 'max-age=31536000')
    }
  },
})

app.use(compression())
app.use(bodyParser.json())
app.use(files)
app.use('/api/v1', routes)

if (process.env.NODE_ENV === 'production') {
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '/../build/index.html'))
  })
}

app.use('*', (req, res) => {
  log.error('not found:', req.originalUrl)
  res.status(404).send({ error: 'route not found' })
})

xrpl.start()
app.listen(PORT, ADDR)
log.info(`server listening on ${ADDR}:${PORT}`)
