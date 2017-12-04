import uuid from 'uuid/v4'

import origins from '../../utils/cards/origins'
import { store } from '../store'
import * as actions from '../../actions'
import { act, getHolder, getCurrentPlayer, getCards, boost, findHolderType, getNextPlayer, getSelectableCards, demage, getIndex, calculate, getHolderTypes, getTableCards, isAlly } from '../../utils'
import * as holders from '../../sources/holders'
import { actionSubject } from '../subjects'

const isWildHunt = ({ card }) => {
  return card.attributes && card.attributes.indexOf('Wild Hunt') !== -1
}

export const eredin = {
  deploy: ({ out, into }) => {
    const associationCards = origins.filter(card => isWildHunt({ card }) && card.type === 'Bronze').map(card => ({
      id: uuid(),
      pickingIndex: into.index,
      ...card,
    }))
    store.dispatch(actions.addCards(associationCards))

    store.dispatch(actions.selectingFrom({ player: getCurrentPlayer({ index: out.index }), holderTypes: ['picking'] }))
  }
}

export const wild_hunt_hound = {
  deploy: ({ out }) => {
    const deckCards = getCards({ type: 'deck', index: out.index })
    const biting_frost = deckCards.find(card => card.key === 'biting_frost')
    if (biting_frost) {
      act({ out: getHolder({ type: 'deck', index: out.index }), into: getHolder({ type: 'table', index: out.index }), card: biting_frost })
    }
  }
}

export const wild_hunt_warrior = {
  deploy: ({ out, card }) => {
    const players = [getNextPlayer({ index: out.index })]
    const selectableCards = getSelectableCards({ card, players })
    const numbers = Math.min(selectableCards.length, 1)
    store.dispatch(actions.selectingSpecific({ card, players, holderTypes: ['fighter', 'archer', 'thrower'], selectableCards, numbers }))
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

export const wild_hunt_navigator = {
  deploy: ({ out, card }) => {
    const players = [getCurrentPlayer({ index: out.index })]
    const selectableCards = getTableCards({ index: out.index }).filter(c => isWildHunt({ card: c }) && c.type === 'Bronze' && c.id !== card.id )
    const numbers = Math.min(selectableCards.length, 1)
    store.dispatch(actions.selectingSpecific({ card, players, holderTypes: ['fighter', 'archer', 'thrower'], selectableCards, numbers }))
  },
  specific: ({ card, specificCards }) => {
    const selectedCard = specificCards[0]
    const index = getIndex({ card })
    const upcomingCard = getCards({ type: 'deck', index }).find(c => c.key === selectedCard.key)
    if (upcomingCard) {
      store.dispatch(actions.selectingTo({
        player: getCurrentPlayer({ index }),
        holderTypes: getHolderTypes({ card: upcomingCard }),
        curriedAction: into => ({ out: getHolder({ type: 'deck', index }), into, card: upcomingCard }),
      }))
    }
  }
}

export const wild_hunt_longship = {
  subscription: {},

  tableIn: ({ out, card }) => {
    if (!wild_hunt_longship.subscription[card.id]) {
      const fulfilledCards = getTableCards({ index: out.index }).filter(c => isWildHunt({ card: c }) && c.id !== card.id )
      fulfilledCards.forEach(card => boost({ card, value: 1 }))

      wild_hunt_longship.subscription[card.id] = actionSubject.subscribe(action => {
        if (isWildHunt({ card: action.card })) {
          const origin = store.getState().cards.find(c => c.id === card.id)
          if (isAlly({ card1: origin, card2: action.card }) && action.card.id !== origin.id) {
            boost({ card: action.card, value: 1 })
          }
        }
      })
    }
  },
  destroyed: ({ out, card }) => {
    if (wild_hunt_longship.subscription[card.id]) {
      const fulfilledCards = getTableCards({ index: out.index }).filter(c => isWildHunt({ card: c }) && c.id !== card.id )
      fulfilledCards.forEach(card => demage({ card, value: 1 }))

      wild_hunt_longship.subscription[card.id].unsubscribe()
    }
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
    const crones = deckCards.filter(card => card.key.indexOf('crone') !== -1)
    crones.forEach(card => act({ out: getHolder({ type: findHolderType({ card }), index: out.index }), into, card }))
  }
}
export const crone__weavess = crone__brewess
export const crone__whispess = crone__brewess
