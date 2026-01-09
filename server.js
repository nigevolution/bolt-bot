import http from 'http'

const PORT = process.env.PORT || 3000

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('BOLT ONLINE')
}).listen(PORT)

console.log('Servidor Bolt ativo na porta', PORT)
