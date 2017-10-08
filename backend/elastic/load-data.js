// @flow

import fs from 'fs'
import elastic from 'elasticsearch'

const client = new elastic.Client({
  host: '127.0.0.1:9200',
  log: 'error',
})
const recipe = JSON.parse(fs.readFileSync('./data/recipes.json', 'utf8'))
const product = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'))

Promise.all([
  client.bulk(makeBody(recipe, 'recipes')),
  client.bulk(makeBody(product, 'products')),
])
  .then(() => console.log('done'))
  .catch(err => console.error(err))

function makeBody(obj, index) {
  const body = []

  for (const k of Object.keys(obj)) {
    const data = obj[k]
    body.push({ index: { _index: index, _type: index, _id: data.id } })
    delete data.id
    body.push(data)
  }

  return { body }
}
