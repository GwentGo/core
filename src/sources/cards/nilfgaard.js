import uuid from 'uuid/v4'

import { store } from '../store'
import * as actions from '../../actions'
import { getCurrentPlayer, getIndex, getHolder, getHolderTypes, removeOut, shuffleIn, findCards, getNextPlayer, getTableCards, boost, get, isEnemy,  } from '../../utils'
import origins from '../../utils/cards/origins'
import { actionSubject } from '../subjects'

export const emissary = {
  deploy: ({ out, card }) => {
    const players = [getCurrentPlayer({ index: out.index })]
    const fulfilledCards = findCards({ ids: getHolder({ type: 'deck', index: out.index }).cardIds }).filter(card => card.type === 'Bronze').slice(0, 2)
    const numbers = Math.min(fulfilledCards.length, 1)
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards: fulfilledCards, numbers }))
  },
  specific: ({ card, specificCards }) => {
    const selectedCard = specificCards[0]
    const outIndex = getNextPlayer({index: getIndex({ card }) }).index
    const outDeck = getHolder({ type: 'deck', index: outIndex })

    store.dispatch(actions.selectingTo({
      player: getCurrentPlayer({ index: outIndex }),
      holderTypes: getHolderTypes({ card: selectedCard }),
      curriedAction: into => ({ out: outDeck, into, card: selectedCard }),
    }))

    const fulfilledCards = findCards({ ids: outDeck.cardIds }).filter(card => card.type === 'Bronze').slice(0, 2)
    const anotherCard = fulfilledCards.find(card => card.id !== selectedCard.id)
    removeOut({ id: anotherCard.id, holder: outDeck })
    shuffleIn({ id: anotherCard.id, holder: outDeck })
  }
}

export const ceallach = {
  deploy: ({ out }) => {
    const associationCards = origins.filter(card => card.key === 'ambassador' || card.key === 'assassin' || card.key === 'emissary').map(card => ({
      id: uuid(),
      pickingIndex: out.index,
      ...card,
    }))
    store.dispatch(actions.addCards(associationCards))

    store.dispatch(actions.selectingFrom({ player: getCurrentPlayer({ index: out.index }), holderTypes: ['picking'] }))
  }
}

export const impera_brigade = {
  subscription: {},

  deploy: ({ out, card }) => {
    if (!impera_brigade.subscription[card.id]) {
      const fulfilledCards = getTableCards({ index: getNextPlayer({ index: out.index }).index }).filter(c => c.isSpy )
      boost({ card, value: fulfilledCards.length * 2 })

      impera_brigade.subscription[card.id] = actionSubject.subscribe(action => {
        if (action.card.isSpy) {
          const updatedCard = get({ card })
          if (isEnemy({ card1: updatedCard, card2: action.card })) {
            boost({ card: updatedCard, value: 2 })
          }
        }
      })
    }
  },
  destroyed: ({ out, card }) => {
    if (impera_brigade.subscription[card.id]) {
      impera_brigade.subscription[card.id].unsubscribe()
    }
  }
}
