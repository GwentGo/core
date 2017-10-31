import React, { Component } from 'react'
import Grid from 'material-ui/Grid'
import { connect } from 'react-redux'

import Card from './Card'
import *  as actions from '../actions'
import players from '../sources/players'
import decks from '../sources/decks'
import cards from '../sources/cards'

class Board extends Component {
  componentDidMount() {
    this.props.receivePlayers(players)
    this.props.receiveDecks(decks)
    this.props.receiveCards(cards)
  }

  render() {
    const { players, decks, cards } = this.props

    return (
      <div>
        {players.map(player => {
          const rate = (player.win / (player.win + player.lose)).toFixed(2)
          const deck = decks.find(deck => deck.playerId === player.id)
          const deckCards = cards.filter(card => card.deckId === deck.id)
          const playerCards = cards.filter(card => card.playerId === player.id)

          return (
            <div key={player.id}>

              <div tag="player-info">
                <h3>{player.name}</h3>
                <p>Win: {player.win}, Lose: {player.lose}, Rate: {rate * 100}%</p>
              </div>

              <div tag="deck-cards">
                <p>Deck cards: {deckCards.length}</p>
                <Grid container>
                  {deckCards.map(card => (
                    <Grid key={card.id} item>
                      <div onClick={() => this.props.updateCard({...card, deckId: '', playerId: player.id })}>
                        <Card card={card} />
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>

              <div tag="player-cards">
                <p>Player cards: {playerCards.length}</p>
                <Grid container>
                  {playerCards.map(card => (
                    <Grid key={card.id} item>
                      <div onClick={() => this.props.updateCard({...card, deckId: deck.id, playerId: '' })}>
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
  decks,
  cards,
})

export default connect(mapStateToProps, actions)(Board)
