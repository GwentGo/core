import React, { Component } from 'react'

import { withStyles } from 'material-ui/styles'
import Card, { CardContent, CardActions } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import { calculatePoints } from '../utils'

const styles = {
  media: {
    width: 160,
  },
}

class CardComponent extends Component {
  render() {
    const { card, onSelecting, classes } = this.props

    return (
      <Card>
        <CardContent>
          <Typography gutterBottom>{calculatePoints({ card })} ({card.power}+{card.boosted}+{card.strengthened})</Typography>
          <img className={classes.media} src={`/images/cards/${card.key}.png`} alt="" title={card.abilities} />
          <Typography>{card.name}</Typography>
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
