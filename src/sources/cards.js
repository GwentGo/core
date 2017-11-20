import uuid from 'uuid/v4'

import originalCards from '../utils/originalCards'
import { store } from './store'
import * as actions from '../actions'
import { getNextPlayer, act, getHolder, getCurrentPlayer, getCards, toggleTurn } from '../utils'
import * as derivativeCards from './derivativeCards'
import * as holders from '../sources/holders'

export const { frost_hazard } = derivativeCards

export const eredin = {
  tableIn: action => {
    const associationCards = originalCards.filter(card => card.name.indexOf('wild_hunt') !== -1 && card.type === 'Bronze')

    store.dispatch(actions.addCards(associationCards.map(card => ({
      id: uuid(),
      pickingIndex: action.into.index,
      ...card,
    }))))

    store.dispatch(actions.receiveSelectingFrom({ player: getCurrentPlayer, holders: ['picking'] }))
  }
}

export const wild_hunt_hound = {
  tableIn: action => {
    const { out } = action

    const deckCards = getCards({ type: 'deck', index: out.index })
    const handCards = getCards({ type: 'hand', index: out.index })

    const foundFromDeck = deckCards.find(card => card.name === 'biting_frost')
    const biting_frost = foundFromDeck ? foundFromDeck : handCards.find(card => card.name === 'biting_frost')
    if (biting_frost) {
      act({ out: getHolder({ type: 'hand', index: out.index }), into: getHolder({ type: 'table', index: out.index }), card: biting_frost })
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
    if (holderWithWeather && holderWithWeather.weather.card.name === 'frost_hazard' && !card.points.hasFrostHazardIncreased) {
      card.points.increased += 6
      card.points.hasFrostHazardIncreased = true
    }

    toggleTurn({ currentPlayer: getCurrentPlayer({ index: out.index }) })
  }
}

export const biting_frost = {
  tableIn: action => {
    const { out, into, card } = action

    store.dispatch(actions.receiveSelectingTo({
      player: getNextPlayer({ index: out.index }),
      holders: ['fighter', 'archer', 'thrower'],
      curriedAction: into => ({ out: { index: out.index, type: 'derivation' }, into, card: derivativeCards.getDerivativeCard({ name: 'frost_hazard' }) }),
    }))

    act({ out: into, into: getHolder({ type: 'tomb', index: out.index }), card })
  }
}
