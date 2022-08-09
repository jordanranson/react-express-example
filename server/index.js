const express = require('express')
const cors = require('cors')
const fs = require('fs').promises
const path = require('path')

/*
 * Configuration
 */

const app = express()
const port = 3001

// Enable CORS
app.use(cors())

// Enable parsing of application/json in the body
app.use(express.json())

/*
 * Routes
 */

app.get('/data', async (req, res) => {
    const filePath = path.join(__dirname, 'data.txt')   

    try {
        const data = await fs.readFile(filePath, { encoding: 'utf-8' })
        res.status(200).json({ ok: true, data })
    } catch (error) {
        res.status(500).json({ ok: false, error })
    }
})

app.post('/data', async (req, res) => {
    const filePath = path.join(__dirname, 'data.txt')   

    try {
        await fs.writeFile(filePath, req.body.data, { encoding: 'utf-8' })
        res.status(200).json({ ok: true })
    } catch (error) {
        res.status(500).json({ ok: false, error })
    }
})

/*
 * Initialization
 */

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
