const express = require('express')
const {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  aliasTopItems,
  // checkID,
  // checkBody,
} = require('./../controllers/menuController')

const router = express.Router()

// router.param('id', checkID)

router.route('/best-sellers').get(aliasTopItems, getAllItems)

router.route('/').get(getAllItems).post(createItem)
// .post(checkBody, createItem)

router.route('/:id').get(getItem).patch(updateItem).delete(deleteItem)

module.exports = router
