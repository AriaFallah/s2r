// @flowA

import bodyParser from 'body-parser'
import cors from 'cors'
import elasticsearch from 'elasticsearch'
import fetch from 'node-fetch'
import express, { type $Request, type $Response } from 'express'
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

app.post('/speech2text', async (req: $Request, res: $Response) => {
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
          r.alternatives
            .filter(a => a.confidence >= 0.75)
            .map(a => a.transcript)
            .reduce((p, c) => p + c, ''),
        )
        .reduce((p, c) => p + c, ''),
    )
    const recipes = await elastic(translation)
    res.json({ 'spices': translation, 'recipes': recipes })
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

app.listen(1337, () => {
  console.log('Listening on 1337...')
})

async function elastic(spices) {
  const client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
  });
  const conditions = []
  for (var spice of spices) {
    conditions.push({
      "match" : {
	"ingredients.ingredientName" : spice
      }
    })
  }
  const query = {
    query: {
      bool : {
	should : conditions,
	minimum_should_match : 1,
      }
    }
  }
  return client.search({
    index: "recipes",
    body: query,
  }).then(body => body.hits.hits)
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
