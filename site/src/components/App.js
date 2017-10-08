// @flow

import React, { Component } from 'react'
import Recorder from './Recorder'

type Props = {}

const Wrap = ({ children }) => children

class App extends Component<Props> {
  render() {
    return (
      <Wrap>
        <main className="main">
          <header>
            <h1>X</h1>
          </header>
          <Recorder />
        </main>
        <footer>Made By: Aria Fallah / Robert Adkins / Matt Callens</footer>
      </Wrap>
    )
  }
}

export default App
