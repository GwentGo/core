import uuid from 'uuid/v4'

import { store } from '../store'
import * as actions from '../../actions'
import { getCurrentPlayer, getIndex, getHolder, getHolderTypes, removeOut, shuffleIn, findCards, getNextPlayer, boost, get, isEnemy, act, findHolderType, getCards } from '../../utils'
import origins from '../../utils/cards/origins'
import { actionSubject } from '../subjects'

export const emissary = {
  deploy: ({ out, card }) => {
    const players = [getCurrentPlayer({ index: out.index })]
    const selectableCards = findCards({ ids: getHolder({ type: 'deck', index: out.index }).cardIds }).filter(card => card.type === 'Bronze').slice(0, 2)
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 1) }))
  },
  specific: ({ card, selectedCard }) => {
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
  subscriptions: {},

  deploy: ({ out, card }) => {
    let subscription = impera_brigade.subscriptions[card.id]
    if (!subscription) {
      const fulfilledCards = getCards({ players: [getNextPlayer({ index: out.index })] }).filter(c => c.isSpy )
      boost({ card, value: fulfilledCards.length * 2 })

      subscription = actionSubject.subscribe(action => {
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
    let subscription = impera_brigade.subscriptions[card.id]
    if (subscription) {
      subscription.unsubscribe()
      subscription = null
    }
  }
}

export const emhyr_var_emreis = {
  deploy: ({ out }) => {
    store.dispatch(actions.selectingFrom({ player: getCurrentPlayer({ index: out.index }), holderTypes: ['hand'] }))
  },
  then: ({ card }) => {
    const index = getIndex({ card })
    const players = [getCurrentPlayer({ index })]
    const selectableCards = getCards({ players }).filter(c => (c.type === 'Bronze' || c.type === 'Silver') && c.id !== card.id)
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 1) }))
  },
  specific: ({ card, selectedCard }) => {
    const index = getIndex({ card })
    act({ out: getHolder({ type: findHolderType({ card: selectedCard }), index }), into: getHolder({ type: 'hand', index }), card: selectedCard })
  }
}
