import players from './mock/players'
import cards from './mock/cards'

const fetch = source => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(source)
    }, 200)
  })
}

export const fetchPlayers = () => {
  return fetch(players)
}

export const fetchCards = () => {
  return fetch(cards)
}
