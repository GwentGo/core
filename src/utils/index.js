import Random from 'random-js'

import { store } from '../sources/store'
import * as actions from '../actions'
import { actionSubject, turnSubject } from '../sources/subjects'
import * as holders from '../sources/holders'

export const getCurrentPlayer = ({ index }) => {
  return store.getState().players.find(player => player.index === index)
}

export const getNextPlayer = ({ index }) => {
  const players = store.getState().players
  const currentPlayer = getCurrentPlayer({ index })

  return players[currentPlayer.index + 1 > players.length - 1 ? 0 : currentPlayer.index + 1]
}

export const toggleTurn = ({ currentPlayer }) => {
  const players = getPlayers()
  const previousWinners = players.filter(player => player.isWinPrevious)
  const nextPlayer = currentPlayer ? getNextPlayer({ index: currentPlayer.index }) : (previousWinners.length === 1 ? previousWinners[0] : players[new Random().integer(0, players.length - 1)])

  turnSubject.next({ player: nextPlayer })
}

export const act = ({out, into, card}) => {
  const modifiedCard = Object.assign({}, card, { [`${out.type}Index`]: '' }, into ? { [`${into.type}Index`]: into.index } : {})
  store.dispatch(actions.updateCard(modifiedCard))
  actionSubject.next({ out, into, card: modifiedCard })
}

export const getCards = ({ type, index }) => {
  return store.getState().cards.filter(card => card[`${type}Index`] === index)
}

export const getTableCards = ({ index }) => {
  if (index !== undefined) {
    return store.getState().cards.filter(card => card.fighterIndex === index || card.archerIndex === index || card.throwerIndex === index)
  } else {
    return store.getState().cards.filter(card => Number.isInteger(card.fighterIndex) || Number.isInteger(card.archerIndex) || Number.isInteger(card.throwerIndex))
  }
}

export const getPlayers = () => {
  return store.getState().players
}

export const calculatePower = ({ cards }) => {
  return cards.reduce((acc, card) => (acc + calculate({ card })), 0)
}

export const calculate = ({ card }) => {
  return card.power + card.boosted + card.strengthened
}

export const getHolder = ({ type, index }) => {
  return holders[`${type}s`].find(holder => holder.index === index)
}

export const getHolderTypes = ({ card }) => {
  const mapping = { 'Melee': 'fighter', 'Ranged': 'archer', 'Siege': 'thrower' }
  return card.row === 'Any' ? ['fighter', 'archer', 'thrower'] : [mapping[card.row]]
}

export const findHolderType = ({ card }) => {
  return ['deck', 'hand', 'fighter', 'archer', 'thrower', 'table'].find(holderType => Number.isInteger(card[`${holderType}Index`]))
}

export const isHolderMatch = ({ holder, holderTypes }) => {
  return holderTypes.indexOf(holder.type) !== -1
}

export const demage = ({ card, value }) => {
  card.boosted -= value

  if (calculate({ card }) <= 0) {
    const holderType = findHolderType({ card })
    store.dispatch(actions.updateCard(Object.assign({}, card, { [`${holderType}Index`]: '' }, card.isDoomed ? {} : { 'tombIndex': card[`${holderType}Index`] } )))
  }
}

export const boost = ({ card, value }) => {
  card.boosted += value
}

export const getIndex = ({ card }) => {
  return card[`${findHolderType({ card })}Index`]
}

export const getSelectableCards = ({ card, players }) => {
  return players.reduce((acc, player) => (acc.concat(getTableCards({ index: player.index }))), []).filter(c => c.id !== card.id)
}
