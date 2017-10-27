import originalCards from '../sources/cards'
import Card from '../models/Card'

const randomCards = cards => {
  const arr = []
  for (let i = 0; i < 25; i++) {
    const randomIndex = parseInt(Math.random() * cards.length, 10)
    arr.push(cards[randomIndex])
    cards = cards.slice(0, randomIndex).concat(cards.slice(randomIndex + 1))
  }
  return arr
}

const cards = randomCards(originalCards)

class Deck {
  cards = []

  constructor() {
    this.setupCards()
  }

  setupCards = () => {
    this.cards = cards.map(card => new Card(card))
  }
}

export default Deck
