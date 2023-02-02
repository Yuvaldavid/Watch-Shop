const express = require('express')
const app = express()
const watches = require('./data/data.json')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {

    return res.render('watches', {
        watches
    })
})

app.get('/watch', (req, res) => {
   
    const watch = watches.find(w => w.id === req.query.id)
    return res.render('overview', {
        watch
    })
})

app.listen(4000, () => {
    console.log(`The Server is running at port 4000`)
})