// @flow

import React, { Component } from 'react'
import Recorder from './Recorder'
import Recipe from './Recipe'
import { connect } from '../redux'

type Props = {
  err: boolean,
  query: ?string,
  recipes: Array<Object>,
}

const Wrap = ({ children }) => children

class App extends Component<Props> {
  render() {
    const { err, query, recipes } = this.props
    console.log(query)

    return (
      <Wrap>
        <header>
          <h1 className="ui header">Speech To Recipes</h1>
          <div style={{ textAlign: 'center' }}>
            <Recorder />
          </div>
        </header>
        <div className="ui divider" />
        {err ? (
          <div className="ui blue message">Please repeat your query.</div>
        ) : null}
        <main>
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
