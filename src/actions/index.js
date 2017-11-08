import * as api from '../utils/api'

export const RECEIVE_PLAYERS = 'RECEIVE_PLAYERS'
export const RECEIVE_CARDS = 'RECEIVE_CARDS'
export const UPDATE_CARD = 'UPDATE_CARD'
export const ADD_CARDS = 'ADD_CARDS'
export const REMOVE_CARDS = 'REMOVE_CARDS'
export const RECEIVE_UI_SELECTING = 'RECEIVE_UI_SELECTING'

export const receivePlayers = players => ({ type: RECEIVE_PLAYERS, players })

export const fetchPlayers = () => dispatch => {
  api
    .fetchPlayers()
    .then(players => dispatch(receivePlayers(players)))
}

export const receiveCards = cards => ({ type: RECEIVE_CARDS, cards })

export const fetchCards = () => dispatch => (
  api
    .fetchCards()
    .then(cards => dispatch(receiveCards(cards)))
)

export const updateCard = card => ({ type: UPDATE_CARD, card })

export const addCards = cards => ({ type: ADD_CARDS, cards })

export const removeCards = cards => ({ type: REMOVE_CARDS, cards })

export const receiveUiSelecting = selecting => ({ type: RECEIVE_UI_SELECTING, selecting })
