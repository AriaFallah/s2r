// @flow

import React, { Component } from 'react'
import { connect } from '../redux'
import { createRecorder } from '../util'
import grid from '../svg/grid.svg'
import rings from '../svg/rings.svg'

type Props = {
  updateError: *,
  updateData: *,
  updateSpices: *,
}

type State = {
  err: boolean,
  isLoading: boolean,
  isRecording: boolean,
  recorder: ?window.MediaRecorder,
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  return new Promise.reject(new Error(response.statusText))
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
        this.setState({ isRecording: true })
        this.props.updateError(false)
      } else {
        recorder.stop()
        this.setState({ isRecording: false })
      }
    }
  }

  updateRecording = (blob: Blob) => {
    this.setState({ isLoading: true })

    fetch('http://localhost:1337/speech2text', {
      method: 'POST',
      body: blob,
    })
      .then(checkStatus)
      .then(r => r.json())
      .then(r => {
        const { recipes, spices } = r
        if (recipes.length === 0) {
          this.props.updateError(true)
          this.setState({ isLoading: false })
          return
        }
        this.setState({ isLoading: false })
        this.props.updateData(recipes)
        this.props.updateSpices(spices)
      })
      .catch(err => console.log(err))
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
export default connect(Recorder, null, dispatch => ({
  updateError: e => dispatch({ type: 'UPDATE_ERROR', payload: e }),
  updateData: d => dispatch({ type: 'UPDATE_DATA', payload: d }),
  updateSpices: s => dispatch({ type: 'UPDATE_SPICES', payload: s }),
}))
