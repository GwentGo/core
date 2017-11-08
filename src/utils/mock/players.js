const players = [{
  id: 1,
  name: 'Geralt',
  win: 215,
  lose: 63,
}, {
  id: 2,
  name: 'Letho',
  win: 371,
  lose: 72,
}]

export default players.map((player, index) => ({
  ...player,
  index,
}))
