import uuid from 'uuid/v4'

import originalCards from '../originalCards'
import { getRandomCards } from '../tools'

const sourceCards = originalCards.map(card => ({
  id: uuid(),
  ...card,
}))

const cards = getRandomCards(sourceCards, { number: 50 })

const cards1 = cards.slice(0, 25).map(card => ({ deckIndex: 0, ...card }))
const cards2 = cards.slice(25).map(card => ({ deckIndex: 1, ...card }))

export default cards1.concat(cards2)
