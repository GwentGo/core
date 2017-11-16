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
