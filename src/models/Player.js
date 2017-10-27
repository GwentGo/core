class Player {
  deck = null

  constructor(props) {
    Object.assign(this, props)
  }

  setupDeck(deck) {
    this.deck = deck
  }
}

export default Player
