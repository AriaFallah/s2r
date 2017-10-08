// @flow

import React, { Component } from 'react'
import Recipe from './Recipe'

type Props = {
  designated: Array<Object>
}

export default class Column extends Component<Props> {
  render() {
    return (
      <div className="ui cards">
        {this.props.designated.map(r =>
          <Recipe data={r} />
        )}
      </div>
    )
  }
}
