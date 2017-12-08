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

export const act = ({ out, into, card }) => {
  const modifiedCard = Object.assign({}, card, { [`${out.type}Index`]: '' }, into ? { [`${into.type}Index`]: into.index } : {})
  store.dispatch(actions.updateCard(modifiedCard))
  actionSubject.next({ out, into, card: modifiedCard })
}

export const getPlayers = () => {
  return store.getState().players
}

export const getCards = ({ holder: { type, index } }) => {
  return store.getState().cards.filter(card => card[`${type}Index`] === index)
}

export const getTableCards = ({ index }) => {
  if (index !== undefined) {
    return store.getState().cards.filter(card => card.fighterIndex === index || card.archerIndex === index || card.throwerIndex === index)
  } else {
    return store.getState().cards.filter(card => Number.isInteger(card.fighterIndex) || Number.isInteger(card.archerIndex) || Number.isInteger(card.throwerIndex))
  }
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
  return ['deck', 'hand', 'fighter', 'archer', 'thrower', 'table', 'tomb'].find(holderType => Number.isInteger(card[`${holderType}Index`]))
}

export const isHolderMatch = ({ holder, holderTypes }) => {
  return holderTypes.indexOf(holder.type) !== -1
}

export const demage = ({ card, value }) => {
  card.boosted -= value

  if (calculate({ card }) <= 0) {
    const index = getIndex({ card })
    act({ out: getHolder({ type: findHolderType({ card }), index }), into: card.isDoomed ? null : getHolder({ type: 'tomb', index }), card: restore({ card }) })
  }
}

export const restore = ({ card }) => {
  return { ...card, boosted: 0, strengthened: 0 }
}

export const boost = ({ card, value }) => {
  card.boosted += value
}

export const getIndex = ({ card }) => {
  return card[`${findHolderType({ card })}Index`]
}

export const getAvailableCards = ({ card, players, holderTypes = ['fighter', 'archer', 'thrower'] }) => {
  return players.reduce((acc, player) => (acc.concat(
    holderTypes.reduce((acc, type) => (acc.concat(getCards({ type, index: player.index }))), [])
  )), []).filter(c => c.id !== card.id)
}

export const isAlly = ({ card1, card2 }) => {
  return getIndex({ card: card1 }) === getIndex({ card: card2 })
}

export const isEnemy = ({ card1, card2 }) => {
  return getIndex({ card: card1 }) !== getIndex({ card: card2 })
}

export const get = ({ card }) => {
  return store.getState().cards.find(c => c.id === card.id)
}

export const isFoundInBothHolder = ({ card, holder1, holder2 }) => {
  return getCards({ holder: holder1 }).find(c => c.key === card.key) && getCards({ holder: holder2 }).find(c => c.key === card.key)
}

export const consume = ({ card, target, isBoost = true }) => {
  isBoost && boost({ card, value: calculate({ card: target }) })

  const index = getIndex({ card: target })
  const out = getHolder({ type: findHolderType({ card: target }), index })
  act({ out, into: out.type === 'tomb' ? null : getHolder({ type: 'tomb', index }), card: target })
}

export const isBelongTo = ({ card, type }) => {
  return card.attributes && card.attributes.indexOf(type) !== -1
}

export const destroy = ({ card }) => {
  const index = getIndex({ card })
  act({ out: getHolder({ type: findHolderType({ card }), index }), into: getHolder({ type: 'tomb', index }), card })
}

export const removeOut = ({ id, holder }) => {
  const cardIds = holder.cardIds
  const n = cardIds.indexOf(id)
  holder.cardIds = cardIds.slice(0, n).concat(cardIds.slice(n + 1))
}

export const shuffleIn = ({ id, holder }) => {
  const cardIds = holder.cardIds
  const n = new Random().integer(0, cardIds.length)
  holder.cardIds = cardIds.slice(0, n).concat(id, cardIds.slice(n))
}

export const syncCardIds = ({ holder }) => {
  const holderCards = getCards({ holder })
  const toRemoveIds = holder.cardIds.reduce((acc, id) => (holderCards.find(card => card.id === id) ? acc : acc.concat(id)), [])
  const toAddIds = holderCards.reduce((acc, card) => (holder.cardIds.find(id => id === card.id) ? acc : acc.concat(card.id)), [])
  toRemoveIds.forEach(id => removeOut({ id, holder }))
  toAddIds.forEach(id => shuffleIn({ id, holder }))
}

export const findCards = ({ ids }) => {
  const cards = store.getState().cards
  return ids.reduce((acc, id) => acc.concat(cards.find(card => card.id === id)), [])
}

export const hasDoneSelecting = () => {
  const { selecting } = store.getState()
  return !(selecting.from || selecting.to || selecting.specific)
}
