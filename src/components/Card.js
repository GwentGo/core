import React, { Component } from 'react'

import Card, { CardContent, CardActions } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import { calculatePoints } from '../utils'

class CardComponent extends Component {
  render() {
    const { card, onSelecting } = this.props

    return (
      <Card>
        <CardContent>
          <Typography type="body2">{calculatePoints({ card })} ({card.points.original}+{card.points.increased}+{card.points.consolidated}) {card.type}</Typography>
          <Typography type="title">{card.name_en}</Typography>
        </CardContent>
        {onSelecting && (
          <CardActions>
            <Button color="accent" onClick={onSelecting}>select</Button>
          </CardActions>
        )}
      </Card>
    )
  }
}

export default CardComponent
