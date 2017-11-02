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

  calculate = cards => {
    return cards.reduce((acc, card) => (acc + card.power), 0)
  }

  render() {
    const { players, cards } = this.props

    return (
      <div>
        {players.map((player, index) => {
          const rate = (player.win / (player.win + player.lose)).toFixed(2)

          const deck = decks.find(deck => deck.index === index)
          const deckCards = cards.filter(card => card.deckIndex === deck.index)

          const hand = hands.find(hand => hand.index === index)
          const handCards = cards.filter(card => card.handIndex === hand.index)

          const desk = desks.find(desk => desk.index === index)
          const deskCards = cards.filter(card => card.deskIndex === desk.index)

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
                      <div onClick={() => this.props.updateCard({...card, deckIndex: '', handIndex: hand.index })}>
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
                      <div onClick={() => this.props.updateCard({...card, handIndex: '', deskIndex: desk.index })}>
                        <Card card={card} />
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>

              <div tag="desk-cards">
                <h4>Desk cards: {deskCards.length}, Power: ({this.calculate(deskCards)})</h4>
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
