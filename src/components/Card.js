import React, { Component } from 'react'
import { connect } from 'react-redux'

import Card, { CardContent, CardActions } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import * as holders from '../sources/holders'

const getHolder = card => {
  if (typeof card.deckIndex === 'number') {
    return holders.decks.find(deck => deck.index === card.deckIndex)
  }
  if (typeof card.handIndex === 'number') {
    return holders.hands.find(hand => hand.index === card.handIndex)
  }
  if (typeof card.fighterIndex === 'number') {
    return holders.fighters.find(fighter => fighter.index === card.fighterIndex)
  }
  if (typeof card.archerIndex === 'number') {
    return holders.archers.find(archer => archer.index === card.archerIndex)
  }
  if (typeof card.throwerIndex === 'number') {
    return holders.throwers.find(thrower => thrower.index === card.throwerIndex)
  }
  if (typeof card.pickingIndex === 'number') {
    return holders.pickings.find(picking => picking.index === card.pickingIndex)
  }
}

class CardComponent extends Component {
  render() {
    const { card, ui, onSelecting } = this.props
    const holder = getHolder(card)

    return (
      <Card>
        <CardContent>
          <Typography type="body2">({card.power}) {card.type}</Typography>
          <Typography type="title">{card.name_en}</Typography>
        </CardContent>
        {ui.selecting && ui.selecting.holder && ui.selecting.holder.id === holder.id && ui.selecting.cards && ui.selecting.cards.length > 0 && (
          <CardActions>
            <Button color="accent" onClick={onSelecting}>select</Button>
          </CardActions>
        )}
      </Card>
    )
  }
}

const mapStateToProps = ({ ui }) => ({
  ui,
})

export default connect(mapStateToProps)(CardComponent)
