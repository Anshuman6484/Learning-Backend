module.exports = (temp, product) => {
  let output = temp.replace(/{#NAME#}/g, product.name)
  output = output.replace(/{#PRICE#}/g, product.price)
  output = output.replace(/{#ID#}/g, product.id)
  output = output.replace(/{#DESCRIPTION#}/g, product.description)
  output = output.replace(/{#IMAGE#}/g, product.image)
  return output
}
