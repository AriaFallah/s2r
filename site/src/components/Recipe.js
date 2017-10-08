// @flow

import React, { Component } from 'react'
import Modal from 'react-modal'

type Props = {
  data: Object,
}

type State = {
  opened: boolean
}

export default class Recipe extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      opened: false
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
              <span className="item">{i.slice(0, i.length - 2)}</span>
            ))}
          </div>
        </Modal>
      </div>
    )
  }
}
