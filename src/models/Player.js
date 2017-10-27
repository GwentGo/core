class Player {
  deck = null

  constructor(props) {
    Object.assign(this, props)
  }

  setupDeck(deck) {
    this.deck = deck
  }

  setupHand(hand) {
    this.hand = hand
  }
}

export default Player
