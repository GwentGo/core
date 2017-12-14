import React, { Component } from 'react'
import { connect } from 'react-redux'

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
import { subscribeActionSubject, turnSubject, subscribeTurnSubject, subscribeWeatherSubject, roundSubject, specificSubject, subscribeSpecificSubject, timerObservable } from '../sources/subjects'
import { getRandomCards } from '../utils/tools'
import { act, getHolder, getCards, getNextPlayer, getPlayers, toggleTurn, getHolderTypes, isHolderMatch, isBelongTo, get, syncCardIds, hasDoneSelecting, destroy, findCards } from '../utils'

const styles = {
  root: {
    paddingTop: 16,
    paddingRight: 8,
    paddingBottom: 16,
    paddingLeft: 8,
  },
  gridList: {
    flexWrap: 'nowrap',
    overflowY: 'auto',
  },
}

class Board extends Component {
  subscription = null

  state = {
    currentPlayer: null,
    replacing: {
      currentIndex: -1,
      numbers: 0,
      remain: 0,
      hasDone: true,
    },
    round: null,
    selectedCards: [],
  }

  componentDidMount() {
    this.props.fetchPlayers()
    this.props.fetchCards().then(() => {
      this.setupHandCards()
      this.setupHolderCardIds()
      roundSubject.next({ sequence: 1 })
    })

    subscribeActionSubject()
    subscribeWeatherSubject()
    subscribeTurnSubject()
    subscribeSpecificSubject()

    turnSubject.subscribe(turn => {
      turn.player.hasPassed ? toggleTurn({ currentPlayer: turn.player }) : this.setupTurn(turn)
    })
    roundSubject.subscribe(round => {
      this.setState({ round }, () => {
        if (round.sequence > 1) {
          this.judge()
          this.clearTable()
          this.assign({ numbers: round.sequence === 2 ? 2 : 1 })
        }
        this.prepare({ round })
      })
    })
  }

  componentDidUpdate() {
    const { selecting } = this.props

    if (selecting.specific && selecting.specific.numbers === 0) {
      this.props.selectingSpecific(null)
    }
  }

  clearTable = () => {
    getCards({ players: getPlayers() }).forEach(card => destroy({ card }))

    holders.fighters.concat(holders.archers, holders.throwers).forEach(holder => holder.weather = null)
  }

  prepare = ({ round }) => {
    if (round.sequence === 1) {
      this.setState({replacing: {
        currentIndex: 0,
        numbers: 3,
        remain: 3,
        hasDone: false,
      }}, this.replacing)
    } else {
      this.setState({
        currentPlayer: null,
        replacing: {
          currentIndex: this.isFinished() ? -1 : 0,
          numbers: 1,
          remain: 1,
          hasDone: false,
        },
      }, this.replacing)
    }
  }

  judge = () => {
    const playerWithHighestPower = getPlayers().reduce((acc, player) => (player.power > acc.power ? player : acc), { power: -Infinity })

    getPlayers().forEach(player => {
      let values = { ...player, hasPassed: false, isWinPrevious: false, power: 0 }
      if (player.power === playerWithHighestPower.power) {
        values = { ...values, wins: ++player.wins, isWinPrevious: true }
      }
      this.props.updatePlayer({ ...values })
    })
  }

  assign = ({ numbers }) => {
    getPlayers().forEach(player => {
      const holder = getHolder({ type: 'deck', index: player.index })

      findCards({ ids: holder.cardIds }).slice(0, numbers).forEach(card => {
        this.props.updateCard({ ...card, deckIndex: '', handIndex: player.index })
      })

      syncCardIds({ holder })
    })
  }

  isFinished = () => {
    return getPlayers().reduce((acc, player) => (player.wins > acc.wins ? player : acc), { wins: -Infinity }).wins === 2
  }

  setupHandCards = () => {
    holders.decks.forEach(deck => {
      const hand = getHolder({ type: 'hand', index: deck.index })

      const leader = this.props.cards.find(card => card.deckIndex === deck.index && card.type === 'Leader')
      this.props.updateCard({ ...leader, deckIndex: '', handIndex: hand.index })

      const deckCards = this.props.cards.filter(card => card.deckIndex === deck.index && card.type !== 'Leader')
      getRandomCards(deckCards, { numbers: 10 }).forEach(card => {
        this.props.updateCard({ ...card, deckIndex: '', handIndex: hand.index })
      })
    })
  }

  setupHolderCardIds = () => {
    holders.decks.forEach(deck => {
      syncCardIds({ holder: deck })
    })
  }

  setupTurn = turn => {
    this.setState({ currentPlayer: turn.player }, () => {
      this.props.selectingFrom({ player: turn.player, holderTypes: ['hand'] })
    })
  }

  replacing = () => {
    const player = this.props.players.find(player => player.index === this.state.replacing.currentIndex)
    this.props.selectingFrom({ player, holderTypes: ['hand'] })
  }

  replaceCard = card => {
    const { replacing } = this.state
    this.props.updateCard({ ...card, handIndex: '', deckIndex: replacing.currentIndex })

    const deck = getHolder({ type: 'deck', index: replacing.currentIndex })
    const randomCard = getRandomCards(getCards({ holder: deck }), { numbers: 1 })[0]
    this.props.updateCard({ ...randomCard, deckIndex: '', handIndex: replacing.currentIndex })

    syncCardIds({ holder: deck })
  }

  isPlayerMatchWithCurrentPlayer = player => {
    const { currentPlayer, replacing } = this.state
    return player.index === (currentPlayer ? currentPlayer.index : replacing.currentIndex)
  }

  isPlayerMatchWithCard = (player, card) => {
    const { currentPlayer } = this.state

    if (card.loyalty.indexOf('Loyal') !== -1 && card.loyalty.indexOf('Disloyal') !== -1) {
      return true
    } else if (isBelongTo({ card, type: 'Special' }) || card.type.indexOf('Leader') !== -1 || card.loyalty.indexOf('Loyal') !== -1) {
      return currentPlayer.index === player.index
    } else {
      return currentPlayer.index !== player.index
    }
  }

  isPlayerMatchWithSelectingPlayer = player => {
    return this.props.selecting.to.player.index === player.index
  }

  canHoldWithPlayerAndCard = (player, card) => {
    return isBelongTo({ card, type: 'Special' }) ? this.isPlayerMatchWithSelectingPlayer(player) : this.isPlayerMatchWithCard(player, card)
  }

  isPlayerMatchWithSelectingPlayers = player => {
    return this.props.selecting.specific.players.find(p => p.index === player.index)
  }

  fromSelected = (holder, card) => {
    this.props.selectingFrom(null)

    if (isBelongTo({ card, type: 'Special' })) {
      this.props.selectingTo(null)

      const table = getHolder({ type: 'table', index: holder.index })
      act({ out: holder, into: table, card })

      const updatedCard = get({ card })
      if (isBelongTo({ card: updatedCard, type: 'derivative' })) {
        act({ out: table, into: null, card: updatedCard })
      } else {
        act({ out: table, into: getHolder({ type: 'tomb', index: holder.index }), card: updatedCard })
      }
    } else {
      this.props.selectingTo({ player: getNextPlayer({ index: holder.index }), holderTypes: getHolderTypes({ card }), curriedAction: into => ({ out: holder, into, card }) })
    }
  }

  toSelected = holder => {
    const { selecting: { to } } = this.props
    const action = to.curriedAction(holder)

    this.props.selectingTo(null)

    act(action)
    to.onSelected && to.onSelected(action)
  }

  pass = player => {
    this.props.updatePlayer({ ...player, hasPassed: true })
    getNextPlayer({ index: player.index }).hasPassed ? roundSubject.next({ sequence: this.state.round.sequence + 1 }) : toggleTurn({ currentPlayer: player })
  }

  subscribeTimerObservable = () => {
    this.subscription = timerObservable.subscribe(() => {
      if (hasDoneSelecting()) {
        this.subscription.unsubscribe()
        this.subscription = null
        toggleTurn({ currentPlayer: this.state.currentPlayer })
      }
    })
  }

  isSelectable = ({ card, selectableCards }) => {
    return selectableCards.find(c => c.id === card.id)
  }

  onSelect = ({ player, card }) => {
    const { selecting } = this.props
    const { selectedCards } = this.state

    let onSelect = null
    if (selecting.specific && this.isPlayerMatchWithSelectingPlayers(player) && selecting.specific.numbers !== 0 && this.isSelectable({ card, selectableCards: selecting.specific.selectableCards })) {
      if (selectedCards.length + 1 === selecting.specific.numbers) {
        onSelect = () => {
          specificSubject.next({ card: selecting.specific.card, selectedCard: selectedCards.concat(card)[0], selectedCards: selectedCards.concat(card) })
          this.props.selectingSpecific(null)
          this.setState({ selectedCards: [] })
        }
      } else {
        onSelect = () => this.setState({ selectedCards: selectedCards.concat(card) })
      }
    }

    return onSelect
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
          const archer = holders.archers.find(archer => archer.index === player.index)
          const thrower = holders.throwers.find(thrower => thrower.index === player.index)

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
                {currentPlayer && currentPlayer.id === player.id && !selecting.to && !selecting.specific && (
                  <Button raised color="accent" onClick={() => { this.pass(player) }}>Pass</Button>
                )}
              </div>

              <br/>

              <div tag="deck-cards">
                <Typography type="subheading" paragraph>
                  Deck({deckCards.length}):
                </Typography>
                <Grid>
                  <Grid container className={classes.gridList}>
                    {deck.cardIds.map(id => {
                      const card = deckCards.find(card => card.id === id)
                      return (
                        <Grid key={card.id} item>
                          <Card card={card} onSelect={this.onSelect({ player, card })} />
                        </Grid>
                      )
                    })}
                  </Grid>
                </Grid>
              </div>

              <br/>

              <div tag="hand-cards">
                <Typography type="subheading" paragraph>
                  Hand({handCards.length}):
                </Typography>
                {!replacing.hasDone && replacing.currentIndex === hand.index && (
                  <Typography type="caption" paragraph>
                    Please replace your card, remain: {replacing.remain}
                    <Button color="accent" onClick={() => {
                      if (replacing.currentIndex === holders.hands.length - 1) {
                        this.setState({ replacing: { ...replacing, hasDone: true } }, () => { toggleTurn({}) })
                      } else {
                        this.setState({ replacing: { ...replacing, currentIndex: replacing.currentIndex + 1, remain: replacing.numbers } }, this.replacing)
                      }
                    }}>finish</Button>
                  </Typography>
                )}
                {replacing.hasDone && this.isPlayerMatchWithCurrentPlayer(player) && (
                  <Typography type="caption" paragraph>
                    Please choose:
                  </Typography>
                )}
                <Grid>
                  <Grid container className={classes.gridList}>
                  {handCards.map(card => {
                    let onSelect = null
                    if (this.isPlayerMatchWithCurrentPlayer(player)) {
                      if (replacing.hasDone) {
                        if (selecting.from && isHolderMatch({ holder: hand, holderTypes: selecting.from.holderTypes })) {
                          onSelect = () => { !this.subscription && this.subscribeTimerObservable(); this.fromSelected(hand, card) }
                        }
                      } else if (card.type !== 'Leader') {
                        if (replacing.remain - 1 > 0) {
                          onSelect = () => { this.replaceCard(card); this.setState({ replacing: { ...replacing, remain: replacing.remain - 1 } }) }
                        } else if (replacing.currentIndex === holders.hands.length - 1) {
                          onSelect = () => { this.replaceCard(card); this.setState({ replacing: { ...replacing, hasDone: true } }, () => { toggleTurn({}) })}
                        } else {
                          onSelect = () => { this.replaceCard(card); this.setState({ replacing: { ...replacing, currentIndex: replacing.currentIndex + 1, remain: replacing.numbers } }, this.replacing) }
                        }
                      }
                    }
                    return (
                      <Grid key={card.id} item>
                        <Card card={card} onSelect={onSelect} />
                      </Grid>
                    )
                  })}
                  </Grid>
                </Grid>
              </div>

              <br/>

              <div tag="table">
                <Paper className={classes.root}>

                  <Typography type="title" gutterBottom>
                    Table:
                  </Typography>

                  <br/>

                  {[fighter, archer, thrower].map(holder => {
                    const holderCards = cards.filter(card => card[`${holder.type}Index`] === holder.index)
                    const mapping = { 'fighter': 'Melee', 'archer': 'Ranged', 'thrower': 'Siege' }

                    return (
                      <div tag={`${holder.type}-cards`} key={holder.type}>
                        <Typography type="subheading" paragraph>
                          {mapping[holder.type]}({holderCards.length}):
                          {selecting.to && this.canHoldWithPlayerAndCard(player, selecting.to.curriedAction().card) && isHolderMatch({ holder, holderTypes: selecting.to.holderTypes }) && (
                            <Button color="accent" onClick={() => this.toSelected(holder)}>select</Button>
                          )}
                        </Typography>
                        {holder.weather && (
                          <Typography type="caption" paragraph>
                            Weather: {holder.weather.card.key}
                          </Typography>
                        )}
                        {holderCards.length > 0 && (
                          <Grid>
                            <Grid container className={classes.gridList}>
                            {holderCards.map(card => (
                              <Grid key={card.id} item>
                                <Card card={card} onSelect={this.onSelect({ player, card })} />
                              </Grid>
                            ))}
                            </Grid>
                          </Grid>
                        )}
                        <br/>
                      </div>
                    )
                  })}
                </Paper>
              </div>

              <br/>

              <div tag="tomb-cards">
                <Typography type="subheading" paragraph>
                  Graveyard({tombCards.length}):
                </Typography>
                {tombCards.length > 0 && (
                  <Grid>
                    <Grid container className={classes.gridList}>
                    {tombCards.map(card => (
                      <Grid key={card.id} item>
                        <Card card={card} onSelect={this.onSelect({ player, card })} />
                      </Grid>
                    ))}
                    </Grid>
                  </Grid>
                )}
              </div>

              <br/>

              {pickingCards.length > 0 && (
                <div tag="picking-cards">
                  <Typography type="subheading" paragraph>
                    Picking({pickingCards.length}):
                  </Typography>
                  <Grid>
                    <Grid container className={classes.gridList}>
                    {pickingCards.map(card => {
                      let onSelect = null
                      if (this.isPlayerMatchWithCurrentPlayer(player)) {
                        if (selecting.from && isHolderMatch({ holder: picking, holderTypes: selecting.from.holderTypes })) {
                          onSelect = () => this.fromSelected(picking, card)
                        }
                      }
                      return (
                        <Grid key={card.id} item>
                          <Card card={card} onSelect={onSelect} />
                        </Grid>
                      )
                    })}
                    </Grid>
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
