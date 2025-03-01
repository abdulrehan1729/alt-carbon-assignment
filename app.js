const express = require('express')
const bodyParser = require('body-parser')
const { PORT } = require('./config/env.config')
const connectDB = require('./config/mongo.config')
const router = require('./routes/router')
const helemt = require('helmet')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
const requestLogger = require('./middleware/logger.middleware')
const { errorHandler } = require('./middleware/errorHandler')

const app = express()
connectDB()

app.use(bodyParser.json())
app.use(cors())
app.use(helemt())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

app.use(requestLogger)

app.use('/api', router)


app.use(errorHandler)

app.listen(PORT, () => {
    console.log('server is running on port 8900')
})

Object.key