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
  tombIndex: xxx,
}]

selecting: {
  from: {
    player,
    holderTypes: ['hand', 'fighter'],
  },
  to: {
    player,
    holderTypes: ['fighter', 'archer', 'thrower'],
    curriedAction: 'function that returns the action object',
    onSelected: 'optional: function called after to selected',
  },
  specific: {
    card,
    players: [],
    holderTypes: ['hand', 'fighter', 'archer', 'thrower'],
    selectableCards: [],
    numbers: xxx,
  }
}

*/

import { combineReducers } from 'redux'

import {
  RECEIVE_PLAYERS,
  UPDATE_PLAYER,
  RECEIVE_CARDS,
  UPDATE_CARD,
  ADD_CARDS,
  REMOVE_CARDS,
  SELECTING_FROM,
  SELECTING_TO,
  SELECTING_SPECIFIC,
} from '../actions'

const players = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_PLAYERS:
      return action.players || state
    case UPDATE_PLAYER:
      return state.map(player => player.id === action.player.id ? action.player : player)
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
    case SELECTING_FROM:
      return { ...state, from: action.from }
    case SELECTING_TO:
      return { ...state, to: action.to }
    case SELECTING_SPECIFIC:
      return { ...state, specific: action.specific }
    default:
      return state
  }
}

export default combineReducers({
  players,
  cards,
  selecting,
})
