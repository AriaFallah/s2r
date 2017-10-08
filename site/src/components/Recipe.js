// @flow

import React, { Component } from 'react'
import Modal from 'react-modal'
import { connect } from '../redux'

Object.assign(Modal.defaultStyles, {
  top: 80,
  left: 80,
  right: 80,
  bottom: 80,
})

type Props = {
  data: Object,
  spices: Array<string>,
}

type State = {
  isModalOpen: boolean,
}

const Wrap = ({ children }) => children

class Recipe extends Component<Props, State> {
  state = {
    isModalOpen: false,
  }

  expand = () => {
    this.setState({ isModalOpen: true })
  }

  closeModal = () => {
    this.setState({ isModalOpen: false })
  }

  render() {
    const { data, spices } = this.props
    const { isModalOpen } = this.state

    return (
      <Wrap>
        <div
          className="ui card"
          onClick={this.expand}
          style={{ height: '100%' }}
        >
          <div className="image">
            <img src={data.mobile_image} alt={data.id} />
          </div>
          <span>Matches: {sanitize(spices, data.ingredients)}</span>
          <div className="content">
            <div className="header">{data.title}</div>
            <div className="meta">{data.servings} servings</div>
            <div className="description">{data.description}</div>
          </div>
          <div className="extra content">
            <span>{data.prep_time} minutes</span>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onRequestClose={this.closeModal}>
          <h2 className="ui header">{data.title}</h2>
          <div className="ui divider" />
          <img alt={data.id} src={data.desktop_image} style={{ width: 300 }} />
          <div className="ui divider" />
          <h4 className="ui header">Directions:</h4>
          <ol className="ui list">
            {data.recipe_instructions.map((x, i) => (
              <li className="item" key={i}>
                {x.replace(/@\*/g, '')}
              </li>
            ))}
          </ol>
        </Modal>
      </Wrap>
    )
  }
}

export default connect(Recipe, state => ({
  spices: state.spices ? state.spices : [],
}))

function sanitize(arr, ingredients) {
  return arr
    .map(spice => spice.toLowerCase())
    .map(spice =>
      ingredients.map(ing => ing.ingredientName).filter(ing => {
        ing = ing.toLowerCase()
        return (
          ing.includes(' ' + spice) ||
          ing.includes(spice + ' ') ||
          ing === spice
        )
      }),
    )
    .reduce((p, c) => p.concat(c), [])
    .join(', ')
    .replace(/&reg/g, '®')
}
