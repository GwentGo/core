const players = [{
  id: 1,
  name: 'Geralt',
}, {
  id: 2,
  name: 'Letho',
}]

export default players.map((player, index) => ({
  ...player,
  index,
  power: 0,
  wins: 0,
  hasPassed: false,
  isWinPrevious: false,
}))
