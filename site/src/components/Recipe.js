// @flow

import React, { Component } from 'react'
import Modal from 'react-modal'
import { connect } from '../redux'

type Props = {
  data: Object,
  spices: Array<string>,
}

type State = {
  isModalOpen: boolean,
}

const Wrap = ({ children }) => children
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  content: {
    position: 'absolute',
    top: '40px',
    left: '25%',
    right: '25%',
    bottom: '40px',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
  },
}

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
    const sanitized = sanitize(spices, data.ingredients)

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

          <div className="content">
            <div className="header">{data.title}</div>
            {sanitized !== '' && (
              <div className="meta">Matches: {sanitized}</div>
            )}
            <div className="description">{data.description}</div>
          </div>
          <div className="extra content">
            <span>Cook Time: {data.time} minutes</span>
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={this.closeModal}
          style={modalStyles}
        >
          <header>
            <h2 className="ui header">{data.title}</h2>
          </header>

          <div className="ui divider" />

          <section>
            <img
              alt={data.id}
              src={data.desktop_image}
              style={{ margin: '0 auto', width: 450 }}
            />
          </section>

          <div className="ui divider" />

          <section>
            <h4 className="ui header">Directions:</h4>
            <ol className="ui list">
              {data.recipe_instructions.map((x, i) => (
                <li className="item" key={i}>
                  {x.replace(/@\*/g, '')}
                </li>
              ))}
            </ol>
          </section>
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
      })
    )
    .reduce((p, c) => p.concat(c), [])
    .join(', ')
    .replace(/&reg/g, '®')
}
