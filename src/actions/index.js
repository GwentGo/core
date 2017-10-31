export const RECEIVE_PLAYERS = 'RECEIVE_PLAYERS'
export const RECEIVE_DECKS = 'RECEIVE_DECKS'
export const RECEIVE_CARDS = 'RECEIVE_CARDS'
export const UPDATE_CARD = 'UPDATE_CARD'

export const receivePlayers = players => ({ type: RECEIVE_PLAYERS, players })
export const receiveDecks = decks => ({ type: RECEIVE_DECKS, decks })
export const receiveCards = cards => ({ type: RECEIVE_CARDS, cards })
export const updateCard = card => ({ type: UPDATE_CARD, card })
