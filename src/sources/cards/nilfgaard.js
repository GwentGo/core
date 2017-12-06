import { store } from '../store'
import * as actions from '../../actions'
import { getCurrentPlayer, getIndex, getHolder, getHolderTypes, removeOut, shuffleIn, findCards, getNextPlayer } from '../../utils'

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
