const mongoose = require('mongoose')

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A menu item must have a name'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'A menu item must have a price'],
  },
  category: {
    type: String,
    enum: ['starter', 'main course', 'dessert', 'beverage', 'fast food'],
    required: [true, 'A menu item must have a category'],
  },
  imageUrl: {
    type: String,
    required: [true, 'A menu item must have an image'],
  },
  available: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1.0'],
    max: [5, 'Rating must be at most 5.0'],
    default: 4.5,
  },
  numRatings: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
})

const Menu = mongoose.model('Menu', menuSchema)

module.exports = Menu
