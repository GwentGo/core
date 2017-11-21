import React, { Component } from 'react'

import { withStyles } from 'material-ui/styles'
import Card, { CardContent, CardActions, CardMedia } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import { calculatePoints } from '../utils'

const styles = {
  media: {
    height: 100,
  },
}

class CardComponent extends Component {
  render() {
    const { card, onSelecting, classes } = this.props

    return (
      <Card>
        <CardContent>
          <Typography type="body2">{calculatePoints({ card })} ({card.power}+{card.boosted}+{card.strengthened}) {card.type}</Typography>
          <CardMedia className={classes.media} image={`/images/cards/${card.key}.png`} title={card.abilities} />
          <Typography type="caption">{card.name}</Typography>
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

export default withStyles(styles)(CardComponent)
