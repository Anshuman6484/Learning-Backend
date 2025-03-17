const fs = require('fs')

const menuData = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/menu.json`)
)

function getIdx(id) {
  return menuData.findIndex((item) => item.id === id)
}

exports.checkID = (req, res, next, val) => {
  console.log(`ID is ${val}`)
  const idx = getIdx(Number(req.params.id))
  if (idx === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    })
  }
  next()
}

exports.checkBody = (req, res, next) => {
  const { name, price } = req.body
  if (!name || !price) {
    return res.status(400).json({
      status: 'fail',
      message: 'missing required properties',
    })
  }
  next()
}

exports.getAllItems = (req, res) => {
  console.log(req.requestTime)
  res.status(200).json({
    status: 'success',
    results: menuData.length,
    data: {
      menu: menuData,
    },
  })
}

exports.getItem = (req, res) => {
  console.log(req.params)
  const idx = getIdx(Number(req.params.id))
  const singleMenu = menuData[idx]

  res.status(200).json({
    status: 'success',
    data: {
      menu: singleMenu,
    },
  })
}

exports.createItem = (req, res) => {
  console.log(req.body)

  const newId = menuData[menuData.length - 1].id + 1
  const newMenu = Object.assign({ id: newId }, req.body)

  menuData.push(newMenu)

  fs.writeFile(
    `${__dirname}/../dev-data/data/menu.json`,
    JSON.stringify(menuData, null, 2),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          menu: newMenu,
        },
      })
    }
  )

  // res.send('new request posted successfully')
}

exports.updateItem = (req, res) => {
  console.log(req.body)
  const idx = getIdx(Number(req.params.id))

  const updatedItem = { ...menuData[idx], ...req.body }
  menuData[idx] = updatedItem

  fs.writeFile(
    `${__dirname}/../dev-data/data/menu.json`,
    JSON.stringify(menuData, null, 2),
    (err) => {
      if (err) {
        res.status(500).json({
          status: 'fail',
          message: 'failed to update menu item',
        })
      }

      res.status(200).json({
        status: 'success',
        data: {
          menuItem: updatedItem,
        },
      })
    }
  )

  // res.status(200).send('menu updated successfully')
}

exports.deleteItem = (req, res) => {
  const idx = getIdx(Number(req.params.id))
  menuData.splice(idx, 1)

  fs.writeFile(
    `${__dirname}/../dev-data/data/menu.json`,
    JSON.stringify(menuData, null, 2),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'fail',
          message: 'failed to delete menu item',
        })
      }

      res.status(200).json({
        status: 'success',
        message: 'item deleted successfully',
      })
    }
  )
}
