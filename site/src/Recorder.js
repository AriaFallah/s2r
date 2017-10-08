// @flow

import React, { Component } from 'react'

type Props = {}
type State = {
  err: boolean,
  isRecording: boolean,
  lastRecording: ?string,
  recorder: ?window.MediaRecorder,
}

function createRecorder(stream, cb) {
  let chunks = []
  const recorder = new window.MediaRecorder(stream)

  recorder.ondataavailable = e => {
    chunks.push(e.data)
  }

  recorder.onstop = e => {
    const blob = new Blob(chunks, { type: 'audio/wav' })
    cb(window.URL.createObjectURL(blob))
    chunks = []
  }

  return recorder
}

class Recorder extends Component<Props, State> {
  listener = null
  state = {
    err: false,
    isRecording: false,
    lastRecording: null,
    recorder: null,
  }

  componentDidMount() {
    const { recorder } = this.state
    if (recorder) {
      window.addEventListener('keydown', this.toggleRecording)
      return
    }

    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => {
          this.setState({
            recorder: createRecorder(stream, this.updateRecording),
          })
          window.addEventListener('keydown', this.toggleRecording)
        })
        .catch(() => this.setState({ err: true }))
    } else if (!this.state.err) {
      this.setState({ err: true })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.toggleRecording)
  }

  toggleRecording = (e: Event) => {
    const { isRecording, recorder } = this.state
    if (!recorder) {
      return
    }

    if (e.keyCode === 13) {
      if (!isRecording) {
        recorder.start()
        this.setState({ isRecording: true })
      } else {
        recorder.stop()
        this.setState({ isRecording: false })
      }
    }
  }

  updateRecording = (url: string) => this.setState({ lastRecording: url })

  render() {
    const { err, isRecording, lastRecording } = this.state
    if (err) {
      return <div>Could not record your request</div>
    }

    return (
      <div>
        {!isRecording ? (
          <div>Press enter to start recording</div>
        ) : (
          <div>Press enter to stop recording</div>
        )}
        {lastRecording && <audio controls src={lastRecording} />}
      </div>
    )
  }
}

export default Recorder
