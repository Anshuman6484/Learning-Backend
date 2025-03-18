const Menu = require('./../models/menuModel')
const APIFeatures = require('./../utils/apiFeatures')

exports.aliasTopItems = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-rating,price'
  req.query.fields = 'name,price,rating'
  next()
}

// getAllItems function
exports.getAllItems = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Menu.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const menu = await features.query

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: menu.length,
      data: {
        menu,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err.message,
    })
  }
}

// getItem function
exports.getItem = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id)
    // Menu.findOne({ _id: req.params.id })

    res.status(200).json({
      status: 'success',
      data: {
        menu,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    })
  }
}

// createItem function
exports.createItem = async (req, res) => {
  try {
    // const newItem = new Menu(req.body)
    // newItem.save()

    const newItem = await Menu.create(req.body)
    res.status(201).json({
      status: 'success',
      data: {
        menu: newItem,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    })
  }
}

// updateItem function
exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    res.status(200).json({
      status: 'success',
      data: {
        menu: updatedItem,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    })
  }
}

// deleteItem function
exports.deleteItem = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
      message: 'item deleted successfully',
    })
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    })
  }
}

exports.getMenuStats = async (req, res) => {
  try {
    const stats = await Menu.aggregate([
      {
        $match: { rating: { $gte: 4 } },
      },
      {
        $group: {
          _id: { $toUpper: '$category' },
          avgRating: { $avg: '$rating' },
          avgPrice: { $avg: '$price' },
          lowestPrice: { $min: '$price' },
          highestPrice: { $max: '$price' },
          totalItems: { $sum: 1 },
        },
      },
      {
        $sort: { avgRating: -1 },
      },
    ])

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err.message,
    })
  }
}

exports.getCategoryInsights = async (req, res) => {
  try {
    const stats = await Menu.aggregate([
      {
        $group: {
          _id: '$category',
          topRatedItem: { $max: '$rating' },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$rating' },
          totalItems: { $sum: 1 },
          itemsList: {
            $push: {
              name: '$name',
              price: '$price',
              rating: '$rating',
              description: '$description',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          avgPrice: 1,
          avgRating: 1,
          topRatedMenuItem: {
            $filter: {
              input: '$itemsList',
              as: 'item',
              cond: { $eq: ['$$item.rating', '$topRatedItem'] },
            },
          },
          allItems: '$itemsList',
        },
      },
    ])
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err.message,
    })
  }
}
