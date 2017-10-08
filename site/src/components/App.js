// @flow

import React, { Component } from 'react'
import Recorder from './Recorder'
import RecipeContainer from './RecipeContainer'
import { connect } from '../redux'

type Props = {
  query: ?string,
}

const Wrap = ({ children }) => children

class App extends Component<Props> {
  render() {
    return (
      <Wrap>
        <header>
          <h1 className="ui header">SpicyTalk</h1>
        </header>
        <main>
          <Recorder />
          {this.props.query != null && (
            <span>Current Query: {this.props.query}</span>
          )}
          <div className="ui divider" />
          <RecipeContainer />
        </main>
      </Wrap>
    )
  }
}

export default connect(App, state => ({ query: state.query }))
