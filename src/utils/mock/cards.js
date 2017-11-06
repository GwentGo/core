import uuid from 'uuid/v4'

import originalCards from '../originalCards'

const sourceCards = Object.keys(originalCards).map(key => ({
  id: uuid(),
  name: key,
  ...originalCards[key],
}))

const randomCards = cards => {
  const arr = []
  for (let i = 0; i < 50; i++) {
    const randomIndex = parseInt(Math.random() * cards.length, 10)
    if (cards[randomIndex]) {
      arr.push(cards[randomIndex])
      cards = cards.slice(0, randomIndex).concat(cards.slice(randomIndex + 1))
    }
  }
  return arr
}

const cards = randomCards(sourceCards)

const cards1 = cards.slice(0, 25).map(card => ({ deckIndex: 0, ...card }))
const cards2 = cards.slice(25).map(card => ({ deckIndex: 1, ...card }))

export default cards1.concat(cards2)
