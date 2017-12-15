import uuid from 'uuid/v4'

import { store } from '../store'
import * as actions from '../../actions'
import { getCurrentPlayer, getIndex, getHolder, getHolderTypes, removeOut, shuffleIn, findCards, getNextPlayer, boost, get, isEnemy, act, findHolderType, getCards, demage, destroy, isBelongTo, getPlayers, syncCardIds } from '../../utils'
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

export const vicovaro_medic = {
  deploy: ({ out, card }) => {
    const players = [getNextPlayer({ index: out.index })]
    const selectableCards = getCards({ players, holderTypes: ['tomb'] }).filter(card => card.type === 'Bronze' && !isBelongTo({ card, type: 'Special' }))
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 1) }))
  },
  specific: ({ card, selectedCard }) => {
    const index = getIndex({ card })
    store.dispatch(actions.selectingTo({
      player: getNextPlayer({ index }),
      holderTypes: getHolderTypes({ card: selectedCard }),
      curriedAction: into => ({ out: getHolder({ type: 'tomb', index }), into, card: selectedCard }),
    }))
  }
}

export const menno_coehoorn = {
  deploy: ({ out, card }) => {
    const players = [getNextPlayer({ index: out.index })]
    const selectableCards = getCards({ players })
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 1) }))
  },
  specific: ({ selectedCard }) => {
    demage({ card: selectedCard, value: 4 })

    if (selectedCard.isSpy) {
      destroy({ card: selectedCard })
    }
  }
}

export const infiltrator = {
  deploy: ({ card }) => {
    const players = getPlayers()
    const selectableCards = getCards({ players }).filter(c => c.isSpy)
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 1) }))
  },
  specific: ({ card, selectedCard }) => {
    store.dispatch(actions.updateCard({ ...selectedCard, isSpy: !selectedCard.isSpy }))
  }
}

export const rainfarn = {
  deploy: ({ out, card }) => {
    const players = [getCurrentPlayer({ index: out.index })]
    const selectableCards = findCards({ ids: getHolder({ type: 'deck', index: out.index }).cardIds }).filter(card => card.isSpy && (card.type === 'Bronze' || card.type === 'Silver'))
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 1) }))
  },
  specific: ({ card, selectedCard }) => {
    const index = getIndex({ card })
    const out = getHolder({ type: 'deck', index })

    store.dispatch(actions.selectingTo({
      player: getCurrentPlayer({ index }),
      holderTypes: getHolderTypes({ card: selectedCard }),
      curriedAction: into => ({ out, into, card: selectedCard }),
    }))

    const fulfilledCards = findCards({ ids: getHolder({ type: 'deck', index: out.index }).cardIds }).filter(card => card.isSpy && (card.type === 'Bronze' || card.type === 'Silver'))
    const anotherCards = fulfilledCards.filter(card => card.id !== selectedCard.id)
    anotherCards.forEach(card => {
      removeOut({ id: card.id, holder: out })
      shuffleIn({ id: card.id, holder: out })
    })
  }
}

export const the_guardian = {
  destroyed: ({ out }) => {
    const holder = getHolder({ type: 'deck', index: getNextPlayer({ index: out.index }).index })

    const card = origins.find(card => card.key === 'lesser_guardians')
    const cards = Array.from(Array(2).keys()).map(() => ({
      ...card,
      id: uuid(),
      deckIndex: holder.index,
    }))
    store.dispatch(actions.addCards(cards))

    syncCardIds({ holder, isShuffleIn: false })
  }
}

export const joachim_de_wett = {
  deploy: ({ out, card }) => {
    const deck = getHolder({ type: 'deck', index: out.index })
    const fulfilledCard = findCards({ ids: deck.cardIds }).find(card => !card.isSpy && (card.type === 'Bronze' || card.type === 'Silver'))

    if (fulfilledCard) {
      store.dispatch(actions.selectingTo({
        player: getCurrentPlayer({ index: out.index }),
        holderTypes: getHolderTypes({ card: fulfilledCard }),
        curriedAction: into => ({ out: deck, into, card: fulfilledCard }),
        onSelected: () => { boost({ card: get({ card: fulfilledCard }), value: 10 }) },
      }))
    }
  }
}
