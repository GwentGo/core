import cards from '../lib/cards/cards.json'
import { specials, common } from './attributes'

const origins = Object.keys(cards).map(key => ({
  ...cards[key],
  ...specials[key],
  ...common(cards[key]),
}))

export default origins
