const mongoose = require('mongoose')
const slugify = require('slugify')
// const validator = require('validator')

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A menu item must have a name'],
      trim: true,
      unique: true,
      maxlength: [30, 'Item name must be less than or equal to 30 characters'],
      minlength: [3, 'Item name must be more than or equal to 3 characters'],
      // validate: [validator.isAlpha, 'Item name must only contain characters'],
    },
    slug: String,
    description: {
      type: String,
      trim: true,
      validate: {
        validator: function (val) {
          // this only points to current doc on new document creation
          return !val.includes(this.name)
        },
        message: 'Description should not contain the item name',
      },
    },
    price: {
      type: Number,
      required: [true, 'A menu item must have a price'],
    },
    category: {
      type: String,
      enum: {
        values: ['fast food', 'main course', 'starter', 'beverage'],
        message:
          'Category is either: fast food, main course, starter or beverage',
      },
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

menuSchema.virtual('totalRating').get(function () {
  return this.rating * this.numRatings
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// menuSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true })
//   next()
// })

// menuSchema.post('save', function (doc, next) {
//   console.log('Document saved', doc)
//   next()
// })

// QUERY MIDDLEWARE
// menuSchema.pre(/^find/, function (next) {
//   this.find({ available: { $ne: true } })
//   this.start = Date.now()
//   next()
// })

// menuSchema.post(/^find/, function (docs, next) {
//   // console.log(docs)
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`)

//   next()
// })

// AGGREGATION MIDDLEWARE
// menuSchema.pre('aggregate', function (next) {
//   console.log(this.pipeline())

//   this.pipeline().unshift({ $match: { available: { $ne: true } } })
//   next()
// })

const Menu = mongoose.model('Menu', menuSchema)

module.exports = Menu
