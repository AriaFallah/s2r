// @flow
// server.js

import express, { type $Request, type $Response } from 'express'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'
import morgan from 'morgan'
import { bluemix } from './utils/config'

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/bluemix/text', async (req: $Request, res: $Response) => {
  const flacData: string = req.body.data
  const auth: string = Buffer.from(
    `${bluemix.speech.user}:${bluemix.speech.password}`,
  ).toString('base64')

  const options: Object = {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      ...bluemix.speech.headers,
    },
    body: Buffer.from(flacData),
  }
  try {
    const response = await fetch(bluemix.speech.url, options).then(r =>
      r.json(),
    )

    response.results.alternatives.length > 0
      ? res.status(200).json({ translation: response.results.alternatives[0] })
      : res.status(404).json({ error: 'No resulting translation received.' })
  } catch (e) {
    console.log(`Error: ${e}`)
    res.status(500).json({
      error:
        'There was an error with the data given to Bluemix Speech to Text service.',
    })
  }
})

app.listen(1337, () => {
  console.log('Listening on 1337...')
})
