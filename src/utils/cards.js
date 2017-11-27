import uuid from 'uuid/v4'

import { importDeck } from './lib/utils/DeckString'

const deckInfo1 = importDeck('4G#5H#9#7T#8#9A#47#8A#8B#89#4T#9R#9R#9R#3K#3K#3K#1O#1O#1O#2W#2W#2W#1R#1R#1R')
deckInfo1[0] = [deckInfo1[0]]

const cards1 = deckInfo1.reduce((acc, arr) => (acc.concat(arr)), []).map(card => ({
  ...card,
  id: uuid(),
  deckIndex: 0,
}))

const deckInfo2 = importDeck('88#5H#13#6I#4I#1A#7W#3G#7Z#7L#8P#50#50#50#3T#3T#K#K#58#58#9P#9P#M#M#M#7P')
deckInfo2[0] = [deckInfo2[0]]
const cards2 = deckInfo2.reduce((acc, arr) => (acc.concat(arr)), []).map(card => ({
  ...card,
  id: uuid(),
  deckIndex: 1,
}))

export default cards1.concat(cards2).map(card => ({
  ...card,
  boosted: 0,
  strengthened: 0,
}))
