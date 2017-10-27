import React, { Component } from 'react'

class Card extends Component {
  render() {
    const { card } = this.props

    return (
      <div>
        <h5>{card.name_en}</h5>
      </div>
    )
  }
}

export default Card
