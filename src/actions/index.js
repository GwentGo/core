import * as api from '../utils/api'

export const RECEIVE_PLAYERS = 'RECEIVE_PLAYERS'
export const UPDATE_PLAYER = 'UPDATE_PLAYER'
export const RECEIVE_CARDS = 'RECEIVE_CARDS'
export const UPDATE_CARD = 'UPDATE_CARD'
export const ADD_CARDS = 'ADD_CARDS'
export const REMOVE_CARDS = 'REMOVE_CARDS'
export const RECEIVE_SELECTING_FROM = 'RECEIVE_SELECTING_FROM'
export const RECEIVE_SELECTING_TO = 'RECEIVE_SELECTING_TO'

export const receivePlayers = players => ({ type: RECEIVE_PLAYERS, players })
export const updatePlayer = player => ({ type: UPDATE_PLAYER, player })

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

export const receiveSelectingFrom = from => ({ type: RECEIVE_SELECTING_FROM, from })
export const receiveSelectingTo = to => ({ type: RECEIVE_SELECTING_TO, to })
