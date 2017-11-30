import uuid from 'uuid/v4'

import originalCards from '../../utils/originalCards'
import { store } from '../store'
import * as actions from '../../actions'
import { act, getHolder, getCurrentPlayer, getCards, boost, findHolderType, getNextPlayer, getSelectableCards, demage, getIndex, calculate } from '../../utils'
import * as holders from '../../sources/holders'

export const eredin = {
  deploy: ({ out, into }) => {
    const associationCards = originalCards.filter(card => card.key.indexOf('wild_hunt') !== -1 && card.type === 'Bronze').map(card => ({
      id: uuid(),
      pickingIndex: into.index,
      ...card,
    }))
    store.dispatch(actions.addCards(associationCards))

    store.dispatch(actions.selectingFrom({ player: getCurrentPlayer({ index: out.index }), holders: ['picking'] }))
  }
}

export const wild_hunt_hound = {
  deploy: ({ out }) => {
    const deckCards = getCards({ type: 'deck', index: out.index })
    const handCards = getCards({ type: 'hand', index: out.index })

    const foundFromDeck = deckCards.find(card => card.key === 'biting_frost')
    const biting_frost = foundFromDeck ? foundFromDeck : handCards.find(card => card.key === 'biting_frost')
    if (biting_frost) {
      act({ out: getHolder({ type: foundFromDeck ? 'deck' : 'hand', index: out.index }), into: getHolder({ type: 'table', index: out.index }), card: biting_frost })
    }
  },
  pickingOut: ({ out }) => {
    const pickingCards = getCards({ type: 'picking', index: out.index })
    store.dispatch(actions.removeCards(pickingCards))
  }
}

export const ice_giant = {
  tableIn: ({ card }) => {
    const holderWithWeather = holders.fighters.concat(holders.archers, holders.throwers).find(holder => holder.weather !== null)
    if (holderWithWeather && holderWithWeather.weather.card.key === 'frost_hazard' && !card.hasFrostHazardBoosted) {
      boost({ card, value: 6 })
      card.hasFrostHazardBoosted = true
    }
  }
}

export const crone__brewess = {
  deploy: ({ out, into }) => {
    const deckCards = getCards({ type: 'deck', index: out.index })
    const handCards = getCards({ type: 'hand', index: out.index })
    const crones = deckCards.concat(handCards).filter(card => card.key.indexOf('crone') !== -1)
    crones.forEach(card => act({ out: getHolder({ type: findHolderType({ card }), index: out.index }), into, card }))
  }
}
export const crone__weavess = crone__brewess
export const crone__whispess = crone__brewess

export const wild_hunt_warrior = {
  deploy: ({ out, card }) => {
    const players = [getNextPlayer({ index: out.index })]
    const selectableCards = getSelectableCards({ card, players })
    const numbers = Math.min(selectableCards.length, 1)
    store.dispatch(actions.selectingSpecific({ card, players, holders: ['fighter', 'archer', 'thrower'], selectableCards, numbers }))
  },
  specific: ({ card, specificCards }) => {
    const selectedCard = specificCards[0]
    demage({ card: selectedCard, value: 3 })

    const holder = getHolder({ type: findHolderType({ card: selectedCard }), index: getIndex({ card: selectedCard }) })
    if (calculate({ card: selectedCard }) <= 0 || (holder.weather && holder.weather.card.key === 'frost_hazard')) {
      boost({ card, value: 2 })
    }
  }
}
