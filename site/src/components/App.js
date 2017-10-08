// @flow

import React, { Component } from 'react'
import Recorder from './Recorder'
import Recipe from './Recipe'
import { connect } from '../redux'

type Props = {
  query: ?string,
  recipes: Array<Object>,
}

const Wrap = ({ children }) => children

class App extends Component<Props> {
  render() {
    const { query, recipes } = this.props

    return (
      <Wrap>
        <header>
          <h1 className="ui header">Speech To Recipes</h1>
        </header>
        <main>
          <Recorder />
          {query != null && <span>Current Query: {query}</span>}
          <div className="ui divider" />
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
  query: state.query,
  recipes: state.data || [],
}))
