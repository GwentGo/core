import React, { Component } from 'react'
import Grid from 'material-ui/Grid'
import { connect } from 'react-redux'

import Card from './Card'
import *  as actions from '../actions'
import decks from '../sources/decks'
import hands from '../sources/hands'
import desks from '../sources/desks'

class Board extends Component {
  componentDidMount() {
    this.props.fetchPlayers()
    this.props.fetchCards()
  }

  render() {
    const { players, cards } = this.props

    return (
      <div>
        {players.map((player, index) => {
          const rate = (player.win / (player.win + player.lose)).toFixed(2)

          const deck = decks.find(deck => deck.index === index)
          const deckCards = cards.filter(card => card.deckId === deck.id)

          const hand = hands.find(hand => hand.index === index)
          const handCards = cards.filter(card => card.handId === hand.id)

          const desk = desks.find(desk => desk.index === index)
          const deskCards = cards.filter(card => card.deskId === desk.id)

          return (
            <div key={player.id}>

              <div tag="player-info">
                <h3>{player.name}</h3>
                <p>Win: {player.win}, Lose: {player.lose}, Rate: {rate * 100}%</p>
              </div>

              <div tag="deck-cards">
                <h4>Deck cards: {deckCards.length}</h4>
                <Grid container>
                  {deckCards.map(card => (
                    <Grid key={card.id} item>
                      <div onClick={() => this.props.updateCard({...card, deckId: '', handId: player.id })}>
                        <Card card={card} />
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>

              <div tag="hand-cards">
                <h4>Hand cards: {handCards.length}</h4>
                <Grid container>
                  {handCards.map(card => (
                    <Grid key={card.id} item>
                      <div onClick={() => this.props.updateCard({...card, deckId: deck.id, handId: '' })}>
                        <Card card={card} />
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>

              <div tag="desk-cards">
                <h4>Desk cards: {deskCards.length}</h4>
                <Grid container>
                  {deskCards.map(card => (
                    <Grid key={card.id} item>
                      <div>
                        <Card card={card} />
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>

              <br />
              <hr />
            </div>
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = ({ players, decks, cards }) => ({
  players,
  cards,
})

export default connect(mapStateToProps, actions)(Board)
