const express = require('express')

const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello world')
})

app.post('/search', (req,res) => {
    console.log(req.body)
    res.sendStatus(200)
})

app.listen(port, () => {
    console.log(`running on port ${port}`)
})
