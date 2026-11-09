// Serves the built site (dist/client) the way Netlify does: /cabins/pickle-hill finds
// /cabins/pickle-hill.html. For checking a build locally: npm run build && npm run serve
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('dist/client')
const PORT = Number(process.env.PORT || 4173)
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' }

http
  .createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    const base = path.join(ROOT, url)
    if (!base.startsWith(ROOT)) return res.writeHead(403).end()
    const file = [base, `${base}.html`, path.join(base, 'index.html')].find((f) => fs.existsSync(f) && fs.statSync(f).isFile())
    if (!file) return res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found')
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' })
    fs.createReadStream(file).pipe(res)
  })
  .listen(PORT, () => console.log(`http://localhost:${PORT}`))
