// @flow

import React, { Component } from 'react'
import Recipe from './Recipe'

type Props = {
  designated: Array<Object>,
}

export default class Column extends Component<Props> {
  render() {
    return (
      <div className="ui cards">
        {this.props.designated.map(r => (
          <Recipe key={r._id} data={r._source} />
        ))}
      </div>
    )
  }
}
