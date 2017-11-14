import { store } from '../sources/store'

export const getCurrentPlayerByIndex = index => {
  return store.getState().players.find(player => player.index === index)
}

export const getNextPlayerByIndex = index => {
  const players = store.getState().players
  const currentPlayer = getCurrentPlayerByIndex(index)

  return players[currentPlayer.index + 1 > players.length - 1 ? 0 : currentPlayer.index + 1]
}
