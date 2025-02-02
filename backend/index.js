// express
const express = require('express')

const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello world')
})

app.post('/search', async (req,res) => {
    const { query } = req.body
    if (!query) {
        return res.status(400).json({error : "empty body"})
    }

    console.log(query)
    res.sendStatus(200)
    
})

app.listen(port, () => {
    console.log(`running on port ${port}`)
})
