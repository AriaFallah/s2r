// @flow

import React, { Component } from 'react'
import Column from './Column'

type Props = {
  recipes: Array<Object>
}

export default class RecipeContainer extends Component<Props> {
  render() {
    const size: number = this.props.recipes.length
    const perColumn: number = Math.floor(size / 4)

    return (
      <div className="ui four column grid">
        <div className="column">
          <Column designated={this.props.recipes.splice(0, perColumn)} />
        </div>

        <div className="column">
          <Column designated={this.props.recipes.splice(0, perColumn)} />
        </div>

        <div className="column">
          <Column designated={this.props.recipes.splice(0, perColumn)} />
        </div>

        <div className="column">
          <Column designated={this.props.recipes.splice(0, this.props.recipes.length)} />
        </div>
      </div>
    )
  }
}
