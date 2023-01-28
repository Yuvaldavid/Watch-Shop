const http = require('http')
const url = require('url')

const server = http.createServer((req, res) => {

    if(req.url === '/favicon.ico') return 
    
    const myUrl = new URL(req.url,'http://localhost:4000')
    const pathname = myUrl.pathname
    const id = myUrl.searchParams.get('id')
    console.log(pathname, id)

    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end('<h1> Welcome to the watch shop</h1>')
    console.log('Server is now running')
})

server.listen(4000)