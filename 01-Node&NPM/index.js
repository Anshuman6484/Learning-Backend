const fs = require('fs')
const http = require('http')
const url = require('url')

const replaceTemplate = require('./modules/replaceTemplate')

const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const tempProducts = fs.readFileSync(
  `${__dirname}/templates/template-products.html`,
  'utf-8'
)

const tempProductDetails = fs.readFileSync(
  `${__dirname}/templates/template-productDetails.html`,
  'utf-8'
)

const tempCards = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
)

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true)

  // HOME PAGE
  if (pathname == '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })

    const prodHtml = dataObj
      .map((item) => replaceTemplate(tempCards, item))
      .join('')
    const output = tempProducts.replace(/{#PRODUCTS_CARD#}/g, prodHtml)

    res.end(output)

    // res.end(tempProducts)
  }

  // PRODUCT DETAILS
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    const product = dataObj[query.id - 1]
    const output = replaceTemplate(tempProductDetails, product)
    res.end(output)
  }
  // API
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(data)
  }
  // NOT FOUND
  else {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end('<h1>Page Not Found</h1>')
  }
})

server.listen(5000, () => {
  console.log('Server is listening on port 5000')
})
