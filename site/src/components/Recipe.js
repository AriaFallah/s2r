// @flow

import React, { Component } from 'react'
import Modal from 'react-modal'
import { connect } from '../redux'

type Props = {
  data: Object,
  spices: Array<string>,
}

type State = {
  opened: boolean,
}

class Recipe extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      opened: false,
    }
  }

  expand = () => {
    this.setState({ opened: true })
  }

  closeModal = () => {
    this.setState({ opened: false })
  }

  render() {
    return (
      <div className="ui card" onClick={this.expand}>
        <div className="image">
          <img src={this.props.data.mobile_image} alt={this.props.data.id} />
        </div>
	<div className="meta">
	<span>Matches: {
	  this.props.spices.map(spice => spice.toLowerCase()).map(
	    spice => this.props.data.ingredients.map(ing => ing.ingredientName).filter(
	      ing => {
		ing = ing.toLowerCase()
 		return ing.includes(' ' + spice) || ing.includes(spice + ' ') || ing === spice
	      }
	    )
	  ).reduce((p, c) => p.concat(c), []).join(', ').replace(/&reg/g, '®')
	}
        </span>
        </div>
        <div className="content">
          <div className="header">{this.props.data.title}</div>
          <div className="meta">{this.props.data.servings} servings</div>
          <div className="description">{this.props.data.description}</div>
        </div>
        <div className="extra content">
          <span>{this.props.data.prep_time} minutes</span>
        </div>

        <Modal
          isOpen={this.state.opened}
          onRequestClose={this.closeModal}
          contentLabel={this.props.data.title}
        >
          <div className="image">
            <img src={this.props.data.desktop_image} alt={this.props.data.id} />
          </div>

          <div className="ui ordered list">
            {this.props.data.recipe_instructions.map(i => (
	      <span className="item" key={"item" + i}>{i.slice(0, i.length - 2)}</span>
            ))}
          </div>
        </Modal>
      </div>
    )
  }
}

export default connect(Recipe, state => ({ spices: state.spices ? state.spices : []}))
