const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const Menu = require('./../../models/menuModel')

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
)

mongoose.connect(DB, {}).then(() => console.log('DB connection successful!'))

// Read file
const menuData = JSON.parse(fs.readFileSync(`${__dirname}/menu.json`, 'utf-8'))

// Import data into DB
const importData = async () => {
  try {
    await Menu.create(menuData)
    console.log('Data successfully loaded!')
  } catch (err) {
    console.log(err)
  }
  process.exit()
}

// Delete all data from DB
const deleteData = async () => {
  try {
    await Menu.deleteMany()
    console.log('Data successfully deleted!')
  } catch (err) {
    console.log(err)
  }
  process.exit()
}

if (process.argv[2] === '--import') {
  importData()
} else if (process.argv[2] === '--delete') {
  deleteData()
}
