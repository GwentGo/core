import React, { Component } from 'react'

import { withStyles } from 'material-ui/styles'
import Card, { CardContent, CardActions } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import { calculate } from '../utils'

const styles = {
  media: {
    width: 160,
  },
}

class CardComponent extends Component {
  render() {
    const { classes, card, onSelect, onUnSelect } = this.props

    return (
      <Card>
        <CardContent>
          <Typography gutterBottom>
            {calculate({ card })} ({card.power}+{card.boosted}+{card.strengthened}) {card.isSpy && (' Spy')}
          </Typography>
          <img className={classes.media} src={`/images/cards/${card.key}.png`} alt="" title={card.abilities} />
          <Typography>{card.name}</Typography>
        </CardContent>
        {(onSelect || onUnSelect) && (
          <CardActions>
            {onSelect && (
              <Button color="accent" onClick={onSelect}>select</Button>
            )}
            {onUnSelect && (
              <Button color="accent" onClick={onUnSelect}>unselect</Button>
            )}
          </CardActions>
        )}
      </Card>
    )
  }
}

export default withStyles(styles)(CardComponent)
