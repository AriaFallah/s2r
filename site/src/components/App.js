// @flow

import React, { Component } from 'react'
import Recorder from './Recorder'
import Recipe from './Recipe'
import { connect } from '../redux'

type Props = {
  err: boolean,
  recipes: Array<Object>,
}

const Wrap = ({ children }) => children

class App extends Component<Props> {
  render() {
    const { err, recipes } = this.props

    return (
      <Wrap>
        <header style={{ paddingBottom: 25, textAlign: 'center' }}>
          <h1 className="ui header">Speech To Recipes</h1>
          <Recorder />
          {err ? (
            <div className="ui blue message">
              No results! Try repeating your query.
            </div>
          ) : null}
        </header>
        <main style={{ width: '100%' }}>
          <div className="ui four column grid">
            {recipes.map(r => (
              <div key={r._id} className="column">
                <Recipe data={r._source} />
              </div>
            ))}
          </div>
        </main>
      </Wrap>
    )
  }
}

export default connect(App, state => ({
  err: state.err,
  recipes: state.data || [],
}))
