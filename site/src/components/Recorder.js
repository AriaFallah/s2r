// @flow

import React, { Component } from 'react'
import { connect } from '../redux'
import { createRecorder } from '../util'
import grid from '../svg/grid.svg'
import rings from '../svg/rings.svg'

type Props = {
  query: ?string,
  updateData: *,
  updateQuery: *,
}

type State = {
  err: boolean,
  isLoading: boolean,
  isRecording: boolean,
  recorder: ?window.MediaRecorder,
}

class Recorder extends Component<Props, State> {
  listener = null
  state = {
    err: false,
    isLoading: false,
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
        this.props.updateQuery(null)
        this.setState({ isRecording: true })
      } else {
        recorder.stop()
        this.setState({ isRecording: false })
      }
    }
  }

  updateRecording = (blob: Blob) => {
    console.log(window.URL.createObjectURL(blob))
    this.setState({ isLoading: true })

    fetch('http://localhost:1337/speech2text', {
      method: 'POST',
      body: blob,
    })
      .then(r => r.json())
      .then(r => {
        const { recipes, spices } = r
        this.setState({ isLoading: false })
        this.props.updateData(recipes)
        this.props.updateSpices(spices)
        this.props.updateQuery(spices.join(', '))
      })
  }

  render() {
    const { err, isLoading, isRecording } = this.state
    if (err) {
      return <div>Something's Broken :'(</div>
    }
    return (
      <div>
        {!isRecording ? (
          <div>
            <div>Press enter to start searching</div>
            {isLoading && (
              <img
                alt="cool loadering thing"
                src={grid}
                style={{
                  display: 'block',
                  margin: '20px auto',
                }}
              />
            )}
          </div>
        ) : (
          <div>
            <div>Press enter to stop searching</div>
            <img
              alt="cool loadering thing"
              src={rings}
              style={{
                display: 'block',
                margin: '0 auto',
              }}
            />
          </div>
        )}
      </div>
    )
  }
}
export default connect(
  Recorder,
  state => ({ query: state.query }),
  dispatch => ({
    updateData: d => dispatch({ type: 'UPDATE_DATA', payload: d }),
    updateSpices: s => dispatch({ type: 'UPDATE_SPICES', payload: s}),
    updateQuery: q => dispatch({ type: 'UPDATE_QUERY', payload: q }),
  }),
)
