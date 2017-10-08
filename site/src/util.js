// @flow

const MIME_TYPE = 'audio/webm'
export function createRecorder(stream: mixed, cb: (b: Blob) => void) {
  let chunks = []
  const recorder = new window.MediaRecorder(stream, { mimeType: MIME_TYPE })

  recorder.ondataavailable = e => {
    chunks.push(e.data)
  }

  recorder.onstop = e => {
    cb(new Blob(chunks, { type: MIME_TYPE }))
    chunks = []
  }

  return recorder
}
