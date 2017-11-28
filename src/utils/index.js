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

export const act = action => {
  const {out, into, card} = action

  const modifiedCard = {...card, [`${out.type}Index`]: '', [`${into.type}Index`]: into.index }
  store.dispatch(actions.updateCard(modifiedCard))
  actionSubject.next({ out, into, card: modifiedCard })
}

export const getHolder = ({ type, index }) => {
  return holders[`${type}s`].find(holder => holder.index === index)
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

export const calculate = ({ cards }) => {
  return cards.reduce((acc, card) => (acc + calculatePoints({ card })), 0)
}

export const calculatePoints = ({ card }) => {
  return card.power + card.boosted + card.strengthened
}

export const findHolderType = ({ card }) => {
  return ['deck', 'hand', 'fighter', 'archer', 'thrower', 'table'].find(holderType => Number.isInteger(card[`${holderType}Index`]))
}

export const demage = ({ card, value }) => {
  card.boosted -= value

  if (calculatePoints({ card }) <= 0) {
    const holderType = findHolderType({ card })
    store.dispatch(actions.updateCard({...card, [`${holderType}Index`]: '', 'tombIndex': card[`${holderType}Index`] }))
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
