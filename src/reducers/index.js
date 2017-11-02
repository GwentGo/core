/*

players = [{
  id: xxx,
}]

cards = [{
  id: xxx,
  deckIndex: xxx,
  handIndex: xxx,
  deskIndex: xxx,
}]

*/

import { combineReducers } from 'redux'

import {
  RECEIVE_PLAYERS,
  RECEIVE_CARDS,
  UPDATE_CARD,
} from '../actions'

const players = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_PLAYERS:
      return action.players || state
    default:
      return state
  }
}

const cards = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_CARDS:
      return action.cards || state
    case UPDATE_CARD:
      return state.map(card => card.id === action.card.id ? action.card : card)
    default:
      return state
  }
}

export default combineReducers({
  players,
  cards,
})
