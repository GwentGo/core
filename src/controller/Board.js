import * as players from '../sources/players'
import originalCards from '../sources/cards'

import Player from '../models/Player'
import Card from '../models/Card'
import Deck from '../models/Deck'

const randomCards = cards => {
  const arr = []
  for (let i = 0; i < 25; i++) {
    const randomIndex = parseInt(Math.random() * cards.length, 10)
    arr.push(cards[randomIndex])
    cards = cards.slice(0, randomIndex).concat(cards.slice(randomIndex + 1))
  }
  return arr
}

class Board {
  player = {
    geralt: null,
    letho: null,
  }

  constructor() {
    this.setupPlayer()

    this.setupDeck(this.player.geralt)
    this.setupDeck(this.player.letho)
  }

  setupPlayer = () => {
    this.player.geralt = new Player(players.geralt)
    this.player.letho = new Player(players.letho)
  }

  setupDeck = player => {
    const deck = new Deck({ cards: randomCards(originalCards).map(card => new Card(card)) })
    player.setupDeck(deck)
  }
}

export default Board
