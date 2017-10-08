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
    const recipes = JSON.parse(JSON.stringify(this.props.recipes))

    return (
      <div className="ui four column grid">
        <div className="column">
          <Column designated={recipes.splice(0, perColumn)} />
        </div>

        <div className="column">
          <Column designated={recipes.splice(0, perColumn)} />
        </div>

        <div className="column">
          <Column designated={recipes.splice(0, perColumn)} />
        </div>

        <div className="column">
          <Column designated={recipes.splice(0, recipes.length)} />
        </div>
      </div>
    )
  }
}

export default connect(RecipeContainer, state => ({
  recipes: state.data || [],
}))
