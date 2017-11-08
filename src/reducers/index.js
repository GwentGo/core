/*

players = [{
  id: xxx,
}]

cards = [{
  id: xxx,
  deckIndex: xxx,
  handIndex: xxx,
  fighterIndex: xxx,
  archerIndex: xxx,
  throwerIndex: xxx,
  pickingIndex: xxx,
}]

ui = {
  selecting: {
    holder: hand,
    cards: [],
  },
}

*/

import { combineReducers } from 'redux'

import {
  RECEIVE_PLAYERS,
  RECEIVE_CARDS,
  UPDATE_CARD,
  ADD_CARDS,
  REMOVE_CARDS,
  RECEIVE_UI_SELECTING,
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
    case ADD_CARDS:
      return state.concat(action.cards)
    case REMOVE_CARDS:
      return state.filter(card => action.cards.map(card => card['id']).indexOf(card.id) === -1)
    default:
      return state
  }
}

const ui = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_UI_SELECTING:
      return { ...state, selecting: action.selecting }
    default:
      return state
  }
}

export default combineReducers({
  players,
  cards,
  ui,
})
