import React, { Component } from 'react'
import { connect } from 'react-redux'

import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'

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
                <Typography type="headline" gutterBottom>
                  {player.name}
                </Typography>
                <Typography type="caption" gutterBottom>
                  Win: {player.win}, Lose: {player.lose}, Rate: {rate * 100}%
                </Typography>
                <Typography type="subheading" gutterBottom>
                  Power: 12
                </Typography>
                <Button raised color="accent" onClick={() => console.log('sss')}>Abandon</Button>
              </div>

              <br/>

              <div tag="deck-cards">
                <Typography type="subheading" gutterBottom>
                  Deck cards: {deckCards.length}
                </Typography>
                <Grid container>
                  {deckCards.map(card => (
                    <Grid key={card.id} item>
                      <Card card={card} />
                    </Grid>
                  ))}
                </Grid>
              </div>

              <br/>

              <div tag="hand-cards">
                <Typography type="subheading" gutterBottom>
                  {ui.selecting && ui.selecting.holder && ui.selecting.holder.id === hand.id && ui.selecting.cards && ui.selecting.cards.length === 0 && (
                    <Button color="accent">select</Button>
                  )}
                  Hand cards: {handCards.length}
                </Typography>
                {!selecting.hasDone && selecting.currentIndex === hand.index && (
                  <Typography type="caption" gutterBottom>
                    Please replace your card, remain: {selecting.remain}
                  </Typography>
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

              <br/>

              <div tag="table-cards">
                <Typography type="subheading" gutterBottom>
                  Fighters:
                </Typography>
                <Grid container>
                  {fighterCards.map(card => (
                    <Grid key={card.id} item>
                      <div>
                        <Card card={card} />
                      </div>
                    </Grid>
                  ))}
                </Grid>

                <br/>

                <Typography type="subheading" gutterBottom>
                  Archers:
                </Typography>
                <Grid container>
                  {archerCards.map(card => (
                    <Grid key={card.id} item>
                      <div>
                        <Card card={card} />
                      </div>
                    </Grid>
                  ))}
                </Grid>

                <br/>

                <Typography type="subheading" gutterBottom>
                  Throwers:
                </Typography>
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

              <br/>

              {pickingCards.length > 0 && (
                <div tag="picking-cards">
                  <Typography type="subheading" gutterBottom>
                    Picking cards: {pickingCards.length}
                  </Typography>
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

              <br/>
              <hr/>
              <br/>
              <br/>

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
