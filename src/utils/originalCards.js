import cards from './lib/cards/cards.json'

const originalCards = Object.keys(cards).map(key => ({
  ...cards[key],
  boosted: 0,
  strengthened: 0,
  isSpy: cards[key].loyalty === 'Disloyal',
}))

export default originalCards
