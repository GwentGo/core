import React, { Component } from 'react'
import { connect } from 'react-redux'
import Random from 'random-js'

import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import SvgIcon from 'material-ui/SvgIcon'
import amber from 'material-ui/colors/amber'

import Card from './Card'
import * as actions from '../actions'
import * as holders from '../sources/holders'
import { subscribeActionSubject, turnSubject, subscribeWeatherSubject, roundSubject } from '../sources/subjects'
import { getRandomCards } from '../utils/tools'
import { act, getHolder, getCards, getNextPlayer, getPlayers, getTableCards } from '../utils'

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
      currentIndex: -1,
      number: 0,
      remain: 0,
      hasDone: true,
    },
    round: null,
  }

  componentDidMount() {
    this.props.fetchPlayers()
    this.props.fetchCards().then(() => {
      this.setupHandCards()
      roundSubject.next({ sequence: 1 })
    })

    subscribeActionSubject()
    subscribeWeatherSubject()

    turnSubject.subscribe(turn => {
      turn.hasDone && this.toggleTurn()
    })

    roundSubject.subscribe(round => {
      this.clearTable()
      this.setState({ round }, () => { this.prepareRound(round) })
    })
  }

  clearTable = () => {
    getPlayers().forEach(player => {
      const tableCards = getTableCards({ index: player.index })
      tableCards.forEach(card => {
        this.props.updateCard({ ...card, fighterIndex: '', archerIndex: '', throwerIndex: '', tombIndex: player.index })
      })
    })
  }

  prepareRound = round => {
    if (round.sequence === 1) {
      this.setState({replacing: {
        currentIndex: 0,
        number: 3,
        remain: 3,
        hasDone: false,
      }}, this.replacing)
    } else {
      this.judge()

      getPlayers().forEach(player => {
        const deckCards = getCards({ type: 'deck', index: player.index })
        getRandomCards(deckCards, { number: round.sequence === 2 ? 2 : 1 }).forEach(card => {
          this.props.updateCard({ ...card, deckIndex: '', handIndex: player.index })
        })
      })

      this.setState({
        currentPlayer: null,
        replacing: {
          currentIndex: this.isFinished() ? -1 : 0,
          number: 1,
          remain: 1,
          hasDone: false,
        },
      }, this.replacing)
    }
  }

  judge = () => {
    let highestPower = 0
    getPlayers().forEach(player => {
      if (player.power > highestPower) {
        highestPower = player.power
      }
    })

    getPlayers().forEach(player => {
      let values = { ...player, hasPassed: false, isWinPrevious: false, power: 0 }
      if (player.power === highestPower) {
        values = { ...values, wins: ++player.wins, isWinPrevious: true }
      }
      this.props.updatePlayer({ ...values })
    })
  }

  isFinished = () => {
    let mostWins = 0
    getPlayers().forEach(player => {
      if (player.wins > mostWins) {
        mostWins = player.wins
      }
    })

    return mostWins === 2
  }

  setupHandCards = () => {
    holders.decks.forEach(deck => {
      const hand = getHolder({ type: 'hand', index: deck.index })

      const leader = this.props.cards.find(card => card.deckIndex === deck.index && card.type === 'Leader')
      this.props.updateCard({ ...leader, deckIndex: '', handIndex: hand.index })

      const deckCards = this.props.cards.filter(card => card.deckIndex === deck.index && card.type !== 'Leader')
      getRandomCards(deckCards, { number: 10 }).forEach(card => {
        this.props.updateCard({ ...card, deckIndex: '', handIndex: hand.index })
      })
    })
  }

  replacing = () => {
    const player = this.props.players.find(player => player.index === this.state.replacing.currentIndex)
    this.props.receiveSelectingFrom({ player, holders: ['hand'] })
  }

  replaceCard = card => {
    const { replacing } = this.state
    this.props.updateCard({ ...card, handIndex: '', deckIndex: replacing.currentIndex })

    const deckCards = this.props.cards.filter(card => card.deckIndex === replacing.currentIndex)
    const randomCard = getRandomCards(deckCards, { number: 1 })[0]
    this.props.updateCard({ ...randomCard, deckIndex: '', handIndex: replacing.currentIndex })
  }

  getNextTurnPlayer = ({ player }) => {
    const nextPlayer = getNextPlayer({ index: player.index })
    return nextPlayer.hasPassed ? this.getNextTurnPlayer({ player: nextPlayer }) : nextPlayer
  }

  toggleTurn = () => {
    const { players } = this.props
    const { currentPlayer } = this.state

    const previousWinners = getPlayers().filter(player => player.isWinPrevious)
    const nextTurnPlayer = currentPlayer ? this.getNextTurnPlayer({ player: currentPlayer }) : (previousWinners.length === 1 ? previousWinners[0] : players[new Random().integer(0, players.length - 1)])

    this.setState({ currentPlayer: nextTurnPlayer }, () => {
      this.props.receiveSelectingFrom({ player: nextTurnPlayer, holders: ['hand'] })
    })
  }

  getHoldersFromCard = card => {
    const mapping = {
      'Melee': 'fighter',
      'Ranged': 'archer',
      'Siege': 'thrower',
    }

    return card.row === 'Any' ? ['fighter', 'archer', 'thrower'] : [mapping[card.row]]
  }

  isPlayerMatchWithCurrentPlayer = player => {
    const { currentPlayer, replacing } = this.state
    return player.index === (currentPlayer ? currentPlayer.index : replacing.currentIndex)
  }

  isPlayerMatchWithCard = (player, card) => {
    const { currentPlayer } = this.state

    if (card.loyalty.indexOf('Loyal') !== -1 && card.loyalty.indexOf('Disloyal') !== -1) {
      return true
    } else if (card.row.indexOf('Special') !== -1 || card.type.indexOf('Leader') !== -1 || card.loyalty.indexOf('Loyal') !== -1) {
      return currentPlayer.index === player.index
    } else {
      return currentPlayer.index !== player.index
    }
  }

  isPlayerMatchWithSelectingPlayer = player => {
    return this.props.selecting.to.player.index === player.index
  }

  canHoldWithPlayerAndCard = (player, card) => {
    return card.row.indexOf('Special') !== -1 ? this.isPlayerMatchWithSelectingPlayer(player) : this.isPlayerMatchWithCard(player, card)
  }

  isHolderMatch = (holders, holder) => {
    return holders.indexOf(holder.type) !== -1
  }

  fromSelected = (holder, card) => {
    this.props.receiveSelectingFrom(null)

    if (card.row.indexOf('Special') !== -1) {
      this.props.receiveSelectingTo(null)

      const table = getHolder({ type: 'table', index: holder.index })
      act({ out: holder, into: table, card })
    } else {
      this.props.receiveSelectingTo({ player: getNextPlayer({ index: holder.index }), holders: this.getHoldersFromCard(card), curriedAction: into => ({ out: holder, into, card }) })
    }
  }

  toSelected = holder => {
    this.props.receiveSelectingTo(null)
    act(this.props.selecting.to.curriedAction(holder))
  }

  pass = player => {
    this.props.updatePlayer({ ...player, hasPassed: true })
    getNextPlayer({ index: player.index }).hasPassed ? roundSubject.next({ sequence: this.state.round.sequence + 1 }) : this.toggleTurn()
  }

  render() {
    const { players, cards, selecting, classes } = this.props
    const { replacing, currentPlayer } = this.state

    return (
      <div>
        {players.map(player => {
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

          const picking = holders.pickings.find(picking => picking.index === player.index)
          const pickingCards = cards.filter(card => card.pickingIndex === picking.index)

          const tomb = holders.tombs.find(tomb => tomb.index === player.index)
          const tombCards = cards.filter(card => card.tombIndex === tomb.index)

          return (
            <div key={player.id}>

              <div tag="player-info">
                <Typography type="headline" gutterBottom>
                  {player.name}
                </Typography>
                {Array.from(Array(player.wins).keys()).map((value, index) => (
                  <SvgIcon key={index}>
                    <path fill={amber[500]} d="M5,16L3,5L8.5,12L12,5L15.5,12L21,5L19,16H5M19,19A1,1 0 0,1 18,20H6A1,1 0 0,1 5,19V18H19V19Z" />
                  </SvgIcon>
                ))}
                <Typography type="subheading" gutterBottom>
                  Power: {player.power}
                </Typography>
                {currentPlayer && currentPlayer.id === player.id && (
                  <Button raised color="accent" onClick={() => { this.pass(player) }}>Pass</Button>
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
                        this.setState({ replacing: { ...replacing, hasDone: true } }, this.toggleTurn)
                      } else {
                        this.setState({ replacing: { ...replacing, currentIndex: replacing.currentIndex + 1, remain: replacing.number } }, this.replacing)
                      }
                    }}>finish</Button>
                  </Typography>
                )}
                {replacing.hasDone && this.isPlayerMatchWithCurrentPlayer(player) && (
                  <Typography type="caption" gutterBottom>
                    Please choose:
                  </Typography>
                )}
                <Grid container>
                  {handCards.map(card => {
                    let onSelecting = null
                    if (this.isPlayerMatchWithCurrentPlayer(player)) {
                      if (replacing.hasDone) {
                        if (selecting.from && this.isHolderMatch(selecting.from.holders, hand)) {
                          onSelecting = () => this.fromSelected(hand, card)
                        }
                      } else if (card.type !== 'Leader') {
                        if (replacing.remain - 1 > 0) {
                          onSelecting = () => { this.replaceCard(card); this.setState({ replacing: { ...replacing, remain: replacing.remain - 1 } }) }
                        } else if (replacing.currentIndex === holders.hands.length - 1) {
                          onSelecting = () => { this.replaceCard(card); this.setState({ replacing: { ...replacing, hasDone: true } }, this.toggleTurn)}
                        } else {
                          onSelecting = () => { this.replaceCard(card); this.setState({ replacing: { ...replacing, currentIndex: replacing.currentIndex + 1, remain: replacing.number } }, this.replacing) }
                        }
                      }
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
                  </Typography>

                  <br/>

                  <div tag="fighter-cards">
                    <Typography type="subheading" gutterBottom>
                      Fighter({fighterCards.length}):
                      {selecting.to && this.canHoldWithPlayerAndCard(player, selecting.to.curriedAction().card) && this.isHolderMatch(selecting.to.holders, fighter) && (
                        <Button color="accent" onClick={() => this.toSelected(fighter)}>select</Button>
                      )}
                    </Typography>
                    {fighter.weather && (
                      <Typography type="caption" gutterBottom>
                        Weather: {fighter.weather.card.name}
                      </Typography>
                    )}
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
                      {selecting.to && this.canHoldWithPlayerAndCard(player, selecting.to.curriedAction().card) && this.isHolderMatch(selecting.to.holders, archer) && (
                        <Button color="accent" onClick={() => this.toSelected(archer)}>select</Button>
                      )}
                    </Typography>
                    {archer.weather && (
                      <Typography type="caption" gutterBottom>
                        Weather: {archer.weather.card.name}
                      </Typography>
                    )}
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
                      {selecting.to && this.canHoldWithPlayerAndCard(player, selecting.to.curriedAction().card) && this.isHolderMatch(selecting.to.holders, thrower) && (
                        <Button color="accent" onClick={() => this.toSelected(thrower)}>select</Button>
                      )}
                    </Typography>
                    {thrower.weather && (
                      <Typography type="caption" gutterBottom>
                        Weather: {thrower.weather.card.name}
                      </Typography>
                    )}
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
                    {pickingCards.map(card => {
                      let onSelecting = null
                      if (this.isPlayerMatchWithCurrentPlayer(player)) {
                        if (selecting.from && this.isHolderMatch(selecting.from.holders, picking)) {
                          onSelecting = () => this.fromSelected(picking, card)
                        }
                      }
                      return (
                        <Grid key={card.id} item>
                          <Card card={card} onSelecting={onSelecting} />
                        </Grid>
                      )
                    })}
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
