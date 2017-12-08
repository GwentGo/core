import uuid from 'uuid/v4'

import origins from '../../utils/cards/origins'
import { store } from '../store'
import * as actions from '../../actions'
import { act, getHolder, getCurrentPlayer, getCards, boost, findHolderType, getNextPlayer, getSelectableCards, demage, getIndex, calculate, getHolderTypes, getTableCards, isAlly, getPlayers, isEnemy, get, isFoundInBothHolder, consume, isBelongTo } from '../../utils'
import * as holders from '../../sources/holders'
import { actionSubject } from '../subjects'
import * as derivatives from './derivatives'

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
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 1) }))
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
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 1) }))
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
  subscriptions: {},

  tableIn: ({ out, card }) => {
    let subscription = wild_hunt_longship.subscriptions[card.id]
    if (!subscription) {
      const fulfilledCards = getTableCards({ index: out.index }).filter(c => isWildHunt({ card: c }) && c.id !== card.id )
      fulfilledCards.forEach(card => boost({ card, value: 1 }))

      subscription = actionSubject.subscribe(action => {
        if (isWildHunt({ card: action.card })) {
          const updatedCard = get({ card })
          if (isAlly({ card1: updatedCard, card2: action.card }) && action.card.id !== updatedCard.id) {
            boost({ card: action.card, value: 1 })
          }
        }
      })
    }
  },
  destroyed: ({ out, card }) => {
    let subscription = wild_hunt_longship.subscriptions[card.id]
    if (subscription) {
      subscription.unsubscribe()
      subscription = null

      const fulfilledCards = getTableCards({ index: out.index }).filter(c => isWildHunt({ card: c }) && c.id !== card.id )
      fulfilledCards.forEach(card => demage({ card, value: 1 }))
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

export const drowner = {
  deploy: ({ card }) => {
    const players = getPlayers()
    const selectableCards = getSelectableCards({ card, players }).filter(c => findHolderType({ card: c }) !== findHolderType({ card }))
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 1) }))
  },
  specific: ({ card, specificCards }) => {
    const selectedCard = specificCards[0]
    const index = getIndex({ card: selectedCard })
    const outHolder = getHolder({ type: findHolderType({ card: selectedCard }), index })
    const intoHolder = getHolder({ type: findHolderType({ card }), index })

    if (isEnemy({ card1: card, card2: selectedCard })) {
      demage({ card: selectedCard, value: intoHolder.weather && intoHolder.weather.card ? 4 : 2 })
    }
    act({ out: outHolder, into: intoHolder, card: selectedCard })
  }
}

export const slyzard = {
  deploy: ({ out, card }) => {
    const players = [getCurrentPlayer({ index: out.index })]
    const holder1 = getHolder({ type: 'tomb', index: out.index })
    const holder2 = getHolder({ type: 'deck', index: out.index })
    const selectableCards = getSelectableCards({ card, players, holderTypes: ['tomb'] }).filter(card => !isBelongTo({ card, type: 'Special' }) && isFoundInBothHolder({ card, holder1, holder2 }))
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 1) }))
  },
  specific: ({ card, specificCards }) => {
    const selectedCard = specificCards[0]
    consume({ card, target: selectedCard, isBoost: false })

    const index = getIndex({ card })
    const out = getHolder({ type: 'deck', index })
    const thatCopy = getCards(out).find(c => c.key === selectedCard.key)
    store.dispatch(actions.selectingTo({
      player: getCurrentPlayer({ index }),
      holderTypes: getHolderTypes({ card: thatCopy }),
      curriedAction: into => ({ out, into, card: thatCopy }),
    }))
  }
}

export const frightener = {
  deploy: ({ into, card }) => {
    const players = [getCurrentPlayer({ index: into.index })]
    const selectableCards = getSelectableCards({ card, players }).filter(c => findHolderType({ card: c }) !== findHolderType({ card }))
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 1) }))
  },
  specific: ({ card, specificCards }) => {
    const selectedCard = specificCards[0]
    const index = getIndex({ card: selectedCard })
    const outHolder = getHolder({ type: findHolderType({ card: selectedCard }), index })
    const intoHolder = getHolder({ type: findHolderType({ card }), index })
    act({ out: outHolder, into: intoHolder, card: selectedCard })

    const player = getNextPlayer({ index })
    const deck = getHolder({ type: 'deck', index: player.index })
    const topCard = getCards(deck)[0]
    act({ out: deck, into: getHolder({ type: 'hand', index: player.index }), card: topCard })
  }
}

export const caranthir = {
  deploy: ({ out, card }) => {
    const players = [getNextPlayer({ index: out.index })]
    const selectableCards = getSelectableCards({ card, players }).filter(c => findHolderType({ card: c }) !== findHolderType({ card }))
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 1) }))
  },
  specific: ({ card, specificCards }) => {
    const selectedCard = specificCards[0]
    const index = getIndex({ card: selectedCard })
    const out = getHolder({ type: findHolderType({ card: selectedCard }), index })
    const into = getHolder({ type: findHolderType({ card }), index })
    act({ out, into, card: selectedCard })

    act({ out: { type: 'derivation', index }, into, card: derivatives.generateDerivativeCard({ key: 'frost_hazard' }) })
  }
}

export const caretaker = {
  deploy: ({ out, card }) => {
    const players = [getNextPlayer({ index: out.index })]
    const selectableCards = getSelectableCards({ card, players, holderTypes: ['tomb'] }).filter(card => card.type === 'Bronze' || card.type === 'Silver')
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 1) }))
  },
  specific: ({ card, specificCards }) => {
    const selectedCard = specificCards[0]
    const index = getIndex({ card })
    store.dispatch(actions.selectingTo({
      player: getNextPlayer({ index }),
      holderTypes: getHolderTypes({ card: selectedCard }),
      curriedAction: into => ({ out: getHolder({ type: 'tomb', index }), into, card: selectedCard }),
    }))
  }
}
