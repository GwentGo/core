import uuid from 'uuid/v4'

import originalCards from '../../utils/originalCards'
import { store } from '../store'
import * as actions from '../../actions'
import { act, getHolder, getCurrentPlayer, getCards, toggleTurn, boost } from '../../utils'
import * as holders from '../../sources/holders'

export const eredin = {
  tableIn: action => {
    const associationCards = originalCards.filter(card => card.key.indexOf('wild_hunt') !== -1 && card.type === 'Bronze').map(card => ({
      id: uuid(),
      pickingIndex: action.into.index,
      ...card,
    }))
    store.dispatch(actions.addCards(associationCards))

    store.dispatch(actions.selectingFrom({ player: getCurrentPlayer, holders: ['picking'] }))
  }
}

export const wild_hunt_hound = {
  tableIn: action => {
    const { out } = action

    const deckCards = getCards({ type: 'deck', index: out.index })
    const handCards = getCards({ type: 'hand', index: out.index })

    const foundFromDeck = deckCards.find(card => card.key === 'biting_frost')
    const biting_frost = foundFromDeck ? foundFromDeck : handCards.find(card => card.key === 'biting_frost')
    if (biting_frost) {
      act({ out: getHolder({ type: foundFromDeck ? 'deck' : 'hand', index: out.index }), into: getHolder({ type: 'table', index: out.index }), card: biting_frost })
    } else {
      toggleTurn({ currentPlayer: getCurrentPlayer({ index: out.index }) })
    }
  },
  pickingOut: action => {
    const pickingCards = getCards({ type: 'picking', index: action.out.index })
    store.dispatch(actions.removeCards(pickingCards))
  }
}

export const ice_giant = {
  tableIn: action => {
    const { out, card } = action

    const holderWithWeather = holders.fighters.concat(holders.archers, holders.throwers).find(holder => holder.weather !== null)
    if (holderWithWeather && holderWithWeather.weather.card.key === 'frost_hazard' && !card.hasFrostHazardBoosted) {
      boost({ card, value: 6 })
      card.hasFrostHazardBoosted = true
    }

    toggleTurn({ currentPlayer: getCurrentPlayer({ index: out.index }) })
  }
}


