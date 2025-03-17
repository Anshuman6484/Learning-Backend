const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const app = require('./app')

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
)

mongoose.connect(DB, {}).then((obj) => console.log('DB connection successful!'))

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`server is listening to requests on port ${port}...`)
})
