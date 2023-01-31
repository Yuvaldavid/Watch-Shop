const { match } = require('assert')
const { readdirSync, fstat } = require('fs')
const http = require('http')
const { disconnect } = require('process')
const url = require('url')
const fs = require('fs').promises
const watches = require('./data/data.json')

const server = http.createServer(async (req, res) => {
    console.log('Server is now running')

    if(req.url === '/favicon.ico') return 
    const myUrl = new URL(req.url,`http://${req.headers.host}/`)
    const pathname = myUrl.pathname
    const id = myUrl.searchParams.get('id')

    if (pathname === '/') {

        let html = await fs.readFile('./view/watches.html', 'utf-8')

        const AllMainWatches = await fs.readFile('./view/main/watchMain.html', 'utf-8')

        let allTheWatches = ''
        for(let index = 0; index < 5; index++){
            allTheWatches += replaceTemplate(AllMainWatches, watches[index])
        }
        html = html.replace(/<%AllMainWatches%>/g, allTheWatches)
        res.writeHead(200, {'Content-Type':'text/html'})
        res.end(html)

    } else if(pathname === "/watch" && id >= 0 && id <= 4) {

        let html = await fs.readFile('./view/overview.html', 'utf-8')
        const watch = watches.find((w) =>  w.id === id)

        html = replaceTemplate(html, watch)
        
        res.writeHead(200, {'Content-Type':'text/html'})
        res.end(html)

    } else if (/\.(png)$/i.test(req.url)){
        const image = await fs.readFile(`./images/${req.url.slice(1)}`)
        res.writeHead(200, {'Content-Type':'image/png'})
        res.end(image)


    } else if (/\.(css)$/i.test(req.url)){
        const css = await fs.readFile(`./css/index.css`)
        res.writeHead(200, {'Content-Type':'text/css'})
        res.end(css)


    } else if (/\.(svg)$/i.test(req.url)){
        const svg = await fs.readFile(`./images/icons.svg`)
        res.writeHead(200, {'Content-Type':'images/svg+xml'})
        res.end(svg)


    } else{
        res.writeHead(404, {'Content-Type':'text/html'})
        res.end('<h1>File Not Found </h1> ')
    }
})

server.listen(4000)

function replaceTemplate(html, watch){
    html = html.replace(/<%IMAGE%>/g, watch.image)
    html = html.replace(/<%NAME%>/g, watch.name)

    let price = watch.originalPrice
    if(watch.hasDiscount){
        price = (price *(100- watch.discount)) / 100
    }
    html = html.replace(/<%NEWPRICE%>/g, `$${price}.00`)
    html = html.replace(/<%OLDPRICE%>/g, `$${watch.originalPrice}`)
    html = html.replace(/<%ID%>/g, watch.id)

    if(watch.discount){
         html = html.replace(
            /<%DISCOUNTRATE%>/g, 
            `<div class="discount__rate"><p> ${watch.discount}% off</p> </div>`)
    } else{
        html = html.replace(/<%DISCOUNTRATE%>/g, ``)
    }

    for(let index = 0; index < watch.stars; index++ ){
        html = html.replace(/<%START%>/, `checked`)
    }

    return html
}