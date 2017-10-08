// @flow

import React, { Component } from 'react'
import Column from './Column'
import { connect } from '../redux'

type Props = {
  recipes: Array<Object>,
}

class RecipeContainer extends Component<Props> {
  render() {
    const size: number = this.props.recipes.length
    const perColumn: number = Math.floor(size / 4)
    const recipes =
      this.props.recipes.length % 4 === 0
        ? this.props.recipes
        : this.props.recipes.slice(
            0,
            this.props.recipes.length - this.props.recipes.length % 4,
          )

    return (
      <div className="ui four column grid">
        <div className="column">
          <Column designated={recipes.slice(0, perColumn)} />
        </div>

        <div className="column">
          <Column designated={recipes.slice(perColumn, perColumn * 2)} />
        </div>

        <div className="column">
          <Column designated={recipes.slice(perColumn * 2, perColumn * 3)} />
        </div>

        <div className="column">
          <Column designated={recipes.slice(perColumn * 3, recipes.length)} />
        </div>
      </div>
    )
  }
}

export default connect(RecipeContainer, state => ({
  recipes: state.data || [],
}))
