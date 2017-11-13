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

selecting: {
  from: {
    player,
    holders: ['hand', 'fighter'],
  },
  to: {
    player,
    holders: ['fighter', 'table', 'thrower'],
    curriedAction: xxx,
  },
  specific: {
    player,
    holders: ['hand', 'fighter', 'table', 'thrower'],
    number: xxx,
    curriedAction: xxx,
  }
}

*/

import { combineReducers } from 'redux'

import {
  RECEIVE_PLAYERS,
  RECEIVE_CARDS,
  UPDATE_CARD,
  ADD_CARDS,
  REMOVE_CARDS,
  RECEIVE_SELECTING_FROM,
  RECEIVE_SELECTING_TO,
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

const selecting = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_SELECTING_FROM:
      return { ...state, from: action.from }
    case RECEIVE_SELECTING_TO:
      return { ...state, to: action.to }
    default:
      return state
  }
}

export default combineReducers({
  players,
  cards,
  selecting,
})
