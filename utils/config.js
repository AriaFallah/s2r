// config.js

export const bluemix = {
  speech: {
    url: 'https://stream.watsonplatform.net/speech-to-text/api/v1/recognize',
    user: '6bb5da6f-ad19-44c8-8f86-51a0620a1e39',
    password: 'a60kHYJ20EYA',
    headers: {
      'Content-Type': 'audio/flac',
      'Transfer-Encoding': 'chunked',
    },
  },
}
