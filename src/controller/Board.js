import Player from '../models/Player'
import * as players from '../sources/players'

class Board {
  player = {
    geralt: null,
    letho: null,
  }

  constructor() {
    this.setupPlayer()
  }

  setupPlayer() {
    this.player.geralt = new Player(players.geralt)
    this.player.letho = new Player(players.letho)
  }
}

export default Board
