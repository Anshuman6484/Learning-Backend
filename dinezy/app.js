const express = require('express')
const app = express()
const morgan = require('morgan')

const menuRouter = require(`${__dirname}/routes/menuRoutes`)
const userRouter = require(`${__dirname}/routes/userRoutes`)

// MIDDLEWARES

app.use(morgan('dev'))
app.use(express.json())
app.use(express.static(`${__dirname}/public`)) // to serve static files

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// ROUTES AND MOUNTING

app.use('/api/v1/menu', menuRouter)
app.use('/api/v1/users', userRouter)

module.exports = app
