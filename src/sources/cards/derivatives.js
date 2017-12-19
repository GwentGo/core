import uuid from 'uuid/v4'

import { weatherSubject } from '../subjects'
import { getCurrentPlayer, getHolder, getCards, calculate, boost } from '../../utils'

export const generate = ({ key }) => ({
  id: uuid(),
  key,
  attributes: ['Special', 'derivative'],
})

export const frost_hazard = {
  tableIn: ({ out, into, card }) => {
    weatherSubject.next({ holder: into, card: card })
  }
}

export const sun_hazard = {
  tableIn: ({ out }) => {
    const index = out.index
    const players = [getCurrentPlayer({ index })]

    const fulfilledCards = getCards({ players }).filter(card => calculate({ card }) < card.power)
    fulfilledCards.forEach(card => boost({ card, value: 2 }))

    void ['fighter', 'archer', 'thrower', 'table'].forEach(holderType => {
      getHolder({ type: holderType, index }).weather = null
    })
  }
}
