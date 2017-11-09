import React, { Component } from 'react'
import { connect } from 'react-redux'
import Random from 'random-js'

import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'

import Card from './Card'
import * as actions from '../actions'
import * as holders from '../sources/holders'
import { actionSubject, subscribeActionSubject, roundSubject } from '../sources/subjects'
import { getRandomCards } from '../utils/helpers'

const styles = {
  root: {
    paddingTop: 16,
    paddingRight: 8,
    paddingBottom: 16,
    paddingLeft: 8,
  },
}

class Board extends Component {
  state = {
    currentPlayer: null,
    replacing: {
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

    subscribeActionSubject()

    roundSubject.subscribe(round => {
      round.hasDone && this.toggleRound()
    })
  }

  calculate = cards => {
    return cards.reduce((acc, card) => (acc + card.power), 0)
  }

  act = action => {
    const {out, into, card} = action

    this.props.updateCard({...card, [`${out.type}Index`]: '', [`${into.type}Index`]: into.index })
    actionSubject.next(action)
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
    const hand = holders.hands.find(hand => hand.index === this.state.replacing.currentIndex)
    const handCards = this.props.cards.filter(card => card.handIndex === hand.index)
    this.props.receiveSelecting({ holder: hand, cards: handCards })
  }

  replaceCard = card => {
    const { replacing } = this.state
    this.props.updateCard({ ...card, handIndex: '', deckIndex: replacing.currentIndex })

    const deckCards = this.props.cards.filter(card => card.deckIndex === replacing.currentIndex)
    const randomCard = getRandomCards(deckCards, { number: 1 })[0]
    this.props.updateCard({ ...randomCard, deckIndex: '', handIndex: replacing.currentIndex })
  }

  start = () => {
    this.props.receiveSelecting({ holder: null, cards: [] })
    this.toggleRound()
  }

  toggleRound = () => {
    const { players } = this.props
    const { currentPlayer } = this.state
    let nextPlayer = null

    if (!currentPlayer) {
      nextPlayer = players[new Random().integer(0, players.length - 1)]
    } else {
      nextPlayer = players[currentPlayer.index + 1 > players.length - 1 ? 0 : currentPlayer.index + 1]
    }

    this.setState({ currentPlayer: nextPlayer }, () => {
      const hand = holders.hands.find(hand => hand.index === nextPlayer.index)
      const handCards = this.props.cards.filter(card => card.handIndex === hand.index)
      this.props.receiveSelecting({ holder: hand, cards: handCards })
    })
  }

  isCardAllowedSelectedToPlayer = (card, player) => {
    const { currentPlayer } = this.state

    if (card.loyalty.indexOf('Loyal') !== -1 && card.loyalty.indexOf('Deloyal') !== -1) {
      return true
    } else if (card.row.indexOf('Special') !== -1 || card.type.indexOf('Leader') !== -1 || card.loyalty.indexOf('Loyal') !== -1) {
      return currentPlayer.index === player.index
    } else {
      return currentPlayer.index !== player.index
    }
  }

  isCardAllowedSelectedToHolder = (card, holder) => {
    const mapping = {
      'fighter': 'Melee',
      'archer': 'Ranged',
      'thrower': 'Siege',
      'table': 'Special',
    }
    const row = card.row.indexOf('Special') !== -1 ? 'Special' : card.row

    return row === mapping[holder.type] || (row === 'Any' && ['fighter', 'archer', 'thrower'].indexOf(holder.type) !== -1 )
  }

  onceSelected = (holder, card) => {
    this.props.receiveSelecting({ holder: null, cards: [], card, curriedAction: into => ({ out: holder, into, card }) })
  }

  twiceSelected = holder => {
    this.act(this.props.selecting.curriedAction(holder))
    this.props.receiveSelecting({ holder: null, cards: [] })
  }

  render() {
    const { players, cards, selecting, classes } = this.props
    const { replacing, currentPlayer } = this.state

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

          const tomb = holders.tombs.find(tomb => tomb.index === player.index)
          const tombCards = cards.filter(card => card.tombIndex === tomb.index)

          const table = holders.tables.find(table => table.index === player.index)

          return (
            <div key={player.id}>

              <div tag="player-info">
                <Typography type="headline" gutterBottom>
                  {player.name}
                </Typography>
                <Typography gutterBottom>
                  Win: {player.win}, Lose: {player.lose}, Rate: {rate * 100}%
                </Typography>
                <Typography type="subheading" gutterBottom>
                  Power: {this.calculate(tableCards)}
                </Typography>
                {currentPlayer && currentPlayer.id === player.id && (
                  <Button raised color="accent">Abandon</Button>
                )}
              </div>

              <br/>

              <div tag="deck-cards">
                <Typography type="subheading" gutterBottom>
                  Deck({deckCards.length}):
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
                  Hand({handCards.length}):
                </Typography>
                {!replacing.hasDone && replacing.currentIndex === hand.index && (
                  <Typography type="caption" gutterBottom>
                    Please replace your card, remain: {replacing.remain}
                    <Button color="accent" onClick={() => {
                      if (replacing.currentIndex === holders.hands.length - 1) {
                        this.setState({ replacing: { ...replacing, hasDone: true } }, this.start)
                      } else {
                        this.setState({ replacing: { ...replacing, currentIndex: replacing.currentIndex + 1, remain: 3 } }, this.replacing)
                      }
                    }}>finish</Button>
                  </Typography>
                )}
                {currentPlayer && currentPlayer.id === player.id && selecting.holder && selecting.holder.id === hand.id && selecting.cards && selecting.cards.length > 0 && (
                  <Typography type="caption" gutterBottom>
                    Please take an action:
                  </Typography>
                )}
                <Grid container>
                  {handCards.map(card => {
                    let onSelecting = null
                    if (replacing.hasDone) {
                      onSelecting = () => this.onceSelected(hand, card)
                    } else if (replacing.remain - 1 > 0) {
                      onSelecting = () => { this.replaceCard(card); this.setState({ replacing: { ...replacing, remain: replacing.remain - 1 } }) }
                    } else if (replacing.currentIndex === holders.hands.length - 1) {
                      onSelecting = () => { this.setState({ replacing: { ...replacing, hasDone: true } }, this.start)}
                    } else {
                      onSelecting = () => { this.setState({ replacing: { ...replacing, currentIndex: replacing.currentIndex + 1, remain: 3 } }, this.replacing) }
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

              <div tag="table">
                <Paper className={classes.root}>

                  <Typography type="title" gutterBottom>
                    Table:
                    {!selecting.holder && selecting.card && this.isCardAllowedSelectedToPlayer(selecting.card, player) && this.isCardAllowedSelectedToHolder(selecting.card, table) && (
                      <Button color="accent" onClick={() => this.twiceSelected(table)}>select</Button>
                    )}
                  </Typography>

                  <br/>

                  <div tag="fighter-cards">
                    <Typography type="subheading" gutterBottom>
                      Fighter({fighterCards.length}):
                      {!selecting.holder && selecting.card && this.isCardAllowedSelectedToPlayer(selecting.card, player) && this.isCardAllowedSelectedToHolder(selecting.card, fighter) && (
                        <Button color="accent" onClick={() => this.twiceSelected(fighter)}>select</Button>
                      )}
                    </Typography>
                    {fighterCards.length > 0 && (
                      <Grid container>
                        {fighterCards.map(card => (
                          <Grid key={card.id} item>
                            <div>
                              <Card card={card} />
                            </div>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </div>

                  <br/>

                  <div tag="archer-cards">
                    <Typography type="subheading" gutterBottom>
                      Archer({archerCards.length}):
                      {!selecting.holder && selecting.card && this.isCardAllowedSelectedToPlayer(selecting.card, player) && this.isCardAllowedSelectedToHolder(selecting.card, archer) && (
                        <Button color="accent" onClick={() => this.twiceSelected(archer)}>select</Button>
                      )}
                    </Typography>
                    {archerCards.length > 0 && (
                      <Grid container>
                        {archerCards.map(card => (
                          <Grid key={card.id} item>
                            <div>
                              <Card card={card} />
                            </div>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </div>
                  
                  <br/>

                  <div tag="thrower-cards">
                    <Typography type="subheading" gutterBottom>
                      Thrower({throwerCards.length}):
                      {!selecting.holder && selecting.card && this.isCardAllowedSelectedToPlayer(selecting.card, player) && this.isCardAllowedSelectedToHolder(selecting.card, thrower) && (
                        <Button color="accent" onClick={() => this.twiceSelected(thrower)}>select</Button>
                      )}
                    </Typography>
                    {throwerCards.length > 0 && (
                      <Grid container>
                        {throwerCards.map(card => (
                          <Grid key={card.id} item>
                            <div>
                              <Card card={card} />
                            </div>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </div>

                </Paper>
              </div>

              <br/>

              <div tag="tomb-cards">
                <Typography type="subheading" gutterBottom>
                  Tomb({tombCards.length}):
                  {!selecting.holder && selecting.card && this.isCardAllowedSelectedToPlayer(selecting.card, player) && this.isCardAllowedSelectedToHolder(selecting.card, tomb) && (
                    <Button color="accent" onClick={() => this.twiceSelected(tomb)}>select</Button>
                  )}
                </Typography>
                {tombCards.length > 0 && (
                  <Grid container>
                    {tombCards.map(card => (
                      <Grid key={card.id} item>
                        <Card card={card} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </div>
              
              <br/>

              {pickingCards.length > 0 && (
                <div tag="picking-cards">
                  <Typography type="subheading" gutterBottom>
                    Picking({pickingCards.length}):
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

const mapStateToProps = ({ players, cards, selecting }) => ({
  players,
  cards,
  selecting,
})

export default connect(mapStateToProps, actions)(withStyles(styles)(Board))
