import React, { Component } from 'react'
import Grid from 'material-ui/Grid'
import { connect } from 'react-redux'

import Card from './Card'
import * as actions from '../actions'
import * as holders from '../sources/holders'
import { subject, subscribe } from '../sources/subject'

class Board extends Component {
  componentDidMount() {
    this.props.fetchPlayers()
    this.props.fetchCards()

    subscribe()
  }

  calculate = cards => {
    return cards.reduce((acc, card) => (acc + card.power), 0)
  }

  act = action => {
    const {out, into, card} = action

    this.props.updateCard({...card, [`${out.type}Index`]: '', [`${into.type}Index`]: into.index })
    subject.next(action)
  }

  render() {
    const { players, cards } = this.props

    return (
      <div>
        {players.map((player, index) => {
          const rate = (player.win / (player.win + player.lose)).toFixed(2)

          const deck = holders.decks.find(deck => deck.index === index)
          const deckCards = cards.filter(card => card.deckIndex === deck.index)

          const hand = holders.hands.find(hand => hand.index === index)
          const handCards = cards.filter(card => card.handIndex === hand.index)

          const fighter = holders.fighters.find(fighter => fighter.index === index)
          const fighterCards = cards.filter(card => card.fighterIndex === fighter.index)

          const archer = holders.archers.find(archer => archer.index === index)
          const archerCards = cards.filter(card => card.archerIndex === archer.index)

          const thrower = holders.throwers.find(thrower => thrower.index === index)
          const throwerCards = cards.filter(card => card.throwerIndex === thrower.index)

          const tableCards = fighterCards.concat(archerCards, throwerCards)

          const picking = holders.pickings.find(picking => picking.index === index)
          const pickingCards = cards.filter(card => card.pickingIndex === picking.index)

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
                      <div onClick={() => this.act({ out: hand, into: fighter, card })}>
                        <Card card={card} />
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>

              <div tag="table-cards">
                <h4>Table cards: {tableCards.length}, Power: ({this.calculate(tableCards)})</h4>
                
                <p>Fighters:</p>
                <Grid container>
                  {fighterCards.map(card => (
                    <Grid key={card.id} item>
                      <div>
                        <Card card={card} />
                      </div>
                    </Grid>
                  ))}
                </Grid>

                <p>Archers:</p>
                <Grid container>
                  {archerCards.map(card => (
                    <Grid key={card.id} item>
                      <div>
                        <Card card={card} />
                      </div>
                    </Grid>
                  ))}
                </Grid>

                <p>Throwers:</p>
                <Grid container>
                  {throwerCards.map(card => (
                    <Grid key={card.id} item>
                      <div>
                        <Card card={card} />
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>

              {pickingCards.length > 0 && (
                <div tag="picking-cards">
                  <h4>Picking cards: {pickingCards.length}</h4>
                  <Grid container>
                    {pickingCards.map(card => (
                      <Grid key={card.id} item>
                        <div onClick={() => {
                          this.act({ out: picking, into: fighter, card })
                          this.props.removeCards(pickingCards.filter(c => c.id !== card.id))
                        }}>
                          <Card card={card} />
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              )}

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
