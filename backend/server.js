// @flowA

import bodyParser from 'body-parser'
import cors from 'cors'
import elasticsearch from 'elasticsearch'
import fetch from 'node-fetch'
import express from 'express'
import morgan from 'morgan'

const BLUEMIX = {
  url: 'https://stream.watsonplatform.net/speech-to-text/api/v1/recognize',
  user: '6bb5da6f-ad19-44c8-8f86-51a0620a1e39',
  password: 'a60kHYJ20EYA',
}
const MIME_TYPE = 'audio/webm'

const app = express()
app.use(bodyParser.raw({ type: MIME_TYPE, limit: '10mb' }))
app.use(cors())
app.use(morgan('dev'))

app.post('/speech2text', async (req, res) => {
  const webmFile = req.body
  const auth: string = Buffer.from(
    `${BLUEMIX.user}:${BLUEMIX.password}`,
  ).toString('base64')

  const options: Object = {
    body: webmFile,
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': MIME_TYPE,
    },
    method: 'POST',
  }

  try {
    const response = await fetch(BLUEMIX.url, options).then(r => r.json())
    if (response.code >= 400) {
      res.status(400).json({ error: response })
      return
    }
    const translation = sikNLPBruh(
      response.results
        .map(r =>
          r.alternatives.map(a => a.transcript).reduce((p, c) => p + c, ''),
        )
        .reduce((p, c) => p + c, ''),
    )

    res.json({
      spices: translation,
      recipes: await elastic(translation),
    })
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

app.listen(1337, () => {
  console.log('Listening on 1337...')
})

function elastic(spices) {
  const client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace',
  })

  const conditions = spices.map(spice => ({
    match: {
      'ingredients.ingredientName': spice,
    },
  }))

  const query = {
    query: {
      bool: {
        should: conditions,
        minimum_should_match: 1,
      },
    },
    size: 12,
  }

  return client
    .search({
      index: 'recipe',
      body: query,
    })
    .then(body => body.hits.hits)
}

function sikNLPBruh(input) {
  const split = input.split('with')
  if (split.length === 1) {
    return []
  }

  return split
    .slice(1)
    .join('')
    .replace(/with\s/g, '')
    .replace(/,/g, '')
    .replace(/and\s/g, '')
    .replace(/or\s/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .split(' ')
}
