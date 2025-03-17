const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const app = require('./app')

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
)

mongoose.connect(DB, {}).then(() => console.log('DB connection successful!'))

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
})

const Menu = mongoose.model('Menu', menuSchema)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`server is listening to requests on port ${port}...`)
})
