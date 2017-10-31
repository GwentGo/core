import originalCards from './originalCards'

const randomCards = cards => {
  const arr = []
  for (let i = 0; i < 50; i++) {
    const randomIndex = parseInt(Math.random() * cards.length, 10)
    arr.push(cards[randomIndex])
    cards = cards.slice(0, randomIndex).concat(cards.slice(randomIndex + 1))
  }
  return arr
}

const cards = randomCards(originalCards)

const cards1 = cards.slice(0, 25).map(card => ({ deckId: 1, handId: '', ...card }))
const cards2 = cards.slice(25).map(card => ({ deckId: 2, handId: '', ...card }))

export default cards1.concat(cards2)
