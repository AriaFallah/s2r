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
        <main className="main">
          <header>
            <h1>Search</h1>
            {this.props.query && (
              <h2>Your current query is {this.props.query}</h2>
            )}
          </header>
          <Recorder />
          <RecipeContainer recipes={[]} />
        </main>
        <footer>Made By: Aria Fallah / Robert Adkins / Matt Callens</footer>
      </Wrap>
    )
  }
}

export default connect(App, state => ({ query: state.query }))
