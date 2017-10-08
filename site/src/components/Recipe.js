// @flow

import React, { Component } from 'react'

type Props = {
  data: Object
}

export default class Recipe extends Component<Props> {
  render() {
    return (
      <div className="ui card">
        <div className="image">
          <img
            src={this.props.data.mobile_image}
            alt={this.props.data.id}
          />
        </div>
        <div className="content">
          <div className="header">{this.props.data.title}</div>
          <div className="meta">{this.props.data.servings} servings</div>
          <div className="description">{this.props.data.description}</div>
        </div>
        <div className="extra content">
          <span>{this.props.data.prep_time} minutes</span>
        </div>
      </div>
    )
  }
}
