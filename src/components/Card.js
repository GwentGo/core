import React, { Component } from 'react'
import Card, { CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'

class CardComponent extends Component {
  render() {
    const { card } = this.props

    return (
      <Card>
        <CardContent>
          <Typography type="body1">{card.type}</Typography>
          <Typography type="title">{card.name_en}</Typography>
        </CardContent>
      </Card>
    )
  }
}

export default CardComponent
