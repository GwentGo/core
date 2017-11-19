import { store } from '../sources/store'
import * as actions from '../actions'
import { actionSubject } from '../sources/subjects'
import * as holders from '../sources/holders'

export const getCurrentPlayer = ({ index }) => {
  return store.getState().players.find(player => player.index === index)
}

export const getNextPlayer = ({ index }) => {
  const players = store.getState().players
  const currentPlayer = getCurrentPlayer({ index })

  return players[currentPlayer.index + 1 > players.length - 1 ? 0 : currentPlayer.index + 1]
}

export const act = action => {
  const {out, into, card} = action

  store.dispatch(actions.updateCard({...card, [`${out.type}Index`]: '', [`${into.type}Index`]: into.index }))
  actionSubject.next(action)
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
    return store.getState().cards.filter(card => card.fighterIndex !== '' || card.archerIndex !== '' || card.throwerIndex !== '')
  }
}

export const getPlayers = () => {
  return store.getState().players
}

export const calculate = cards => {
  return cards.reduce((acc, card) => (acc + calculatePoints({ card })), 0)
}

export const calculatePoints = ({ card }) => {
  return card.points.original + card.points.increased + card.points.consolidated
}
