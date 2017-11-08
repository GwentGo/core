import React, { Component } from 'react'
import { connect } from 'react-redux'

import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button';

import Card from './Card'
import * as actions from '../actions'
import * as holders from '../sources/holders'
import { subject, subscribe } from '../sources/subject'
import { getRandomCards } from '../utils/helpers'

class Board extends Component {
  state = {
    currentPlayer: null,
    selecting: {
      currentIndex: 0,
      remain: 3,
      hasDone: false,
    },
  }

  componentDidMount() {
    this.props.fetchPlayers()
    this.props.fetchCards().then(() => {
      this.setupHandCards()
      this.replacing()
    })

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

  setupHandCards = () => {
    holders.decks.forEach(deck => {
      const deckCards = this.props.cards.filter(card => card.deckIndex === deck.index)
      const hand = holders.hands.find(hand => hand.index === deck.index)

      getRandomCards(deckCards, { number: 10 }).forEach(card => {
        this.props.updateCard({ ...card, deckIndex: '', handIndex: hand.index })
      })
    })
  }

  replacing = () => {
    const hand = holders.hands.find(hand => hand.index === this.state.selecting.currentIndex)
    const handCards = this.props.cards.filter(card => card.handIndex === hand.index)
    this.props.receiveUiSelecting({ holder: hand, cards: handCards })
  }

  replaceCard = card => {
    const { selecting } = this.state
    this.props.updateCard({ ...card, handIndex: '', deckIndex: selecting.currentIndex })

    const deckCards = this.props.cards.filter(card => card.deckIndex === selecting.currentIndex)
    const randomCard = getRandomCards(deckCards, { number: 1 })[0]
    this.props.updateCard({ ...randomCard, deckIndex: '', handIndex: selecting.currentIndex })
  }

  start = () => {
    console.log('happy gwent');
  }

  render() {
    const { players, cards, ui } = this.props
    const { selecting } = this.state

    return (
      <div>
        {players.map(player=> {
          const rate = (player.win / (player.win + player.lose)).toFixed(2)

          const deck = holders.decks.find(deck => deck.index === player.index)
          const deckCards = cards.filter(card => card.deckIndex === deck.index)

          const hand = holders.hands.find(hand => hand.index === player.index)
          const handCards = cards.filter(card => card.handIndex === hand.index)

          const fighter = holders.fighters.find(fighter => fighter.index === player.index)
          const fighterCards = cards.filter(card => card.fighterIndex === fighter.index)

          const archer = holders.archers.find(archer => archer.index === player.index)
          const archerCards = cards.filter(card => card.archerIndex === archer.index)

          const thrower = holders.throwers.find(thrower => thrower.index === player.index)
          const throwerCards = cards.filter(card => card.throwerIndex === thrower.index)

          const tableCards = fighterCards.concat(archerCards, throwerCards)

          const picking = holders.pickings.find(picking => picking.index === player.index)
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
                      <Card card={card} />
                    </Grid>
                  ))}
                </Grid>
              </div>

              <div tag="hand-cards">
                <h4>
                  {ui.selecting && ui.selecting.holder && ui.selecting.holder.id === hand.id && ui.selecting.cards && ui.selecting.cards.length === 0 && (
                    <Button color="accent">select</Button>
                  )}
                  Hand cards: {handCards.length}
                </h4>
                {!selecting.hasDone && selecting.currentIndex === hand.index && (
                  <p>Please replace your card, remain: {selecting.remain}</p>
                )}
                <Grid container>
                  {handCards.map(card => {
                    let onSelecting = null
                    if (selecting.hasDone) {
                      onSelecting = () => { console.log('hi there!') }
                    } else if (selecting.remain - 1 > 0) {
                      onSelecting = () => { this.replaceCard(card); this.setState({ selecting: { ...selecting, remain: selecting.remain - 1 } }) }
                    } else if (selecting.currentIndex === holders.hands.length - 1) {
                      onSelecting = () => { this.setState({ selecting: { ...selecting, hasDone: true } }, this.start); this.props.receiveUiSelecting({ holder: null, cards: [] }) }
                    } else {
                      onSelecting = () => { this.setState({ selecting: { ...selecting, currentIndex: selecting.currentIndex + 1, remain: 3 } }, this.replacing) }
                    }
                    return (
                      <Grid key={card.id} item>
                        <Card card={card} onSelecting={onSelecting} />
                      </Grid>
                    )
                  })}
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

const mapStateToProps = ({ players, cards, ui }) => ({
  players,
  cards,
  ui,
})

export default connect(mapStateToProps, actions)(Board)
