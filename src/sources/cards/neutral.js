import { store } from '../store'
import * as actions from '../../actions'
import { getNextPlayer, act, getHolder, getCurrentPlayer, boost, getSelectableCards, getIndex, findHolderType, calculate, destroy, getCards, calculatePower } from '../../utils'
import * as derivatives from './derivatives'

export const biting_frost = {
  tableIn: ({ out, into, card }) => {
    store.dispatch(actions.selectingTo({
      player: getNextPlayer({ index: out.index }),
      holderTypes: ['fighter', 'archer', 'thrower'],
      curriedAction: into => ({ out: { type: 'derivation', index: out.index }, into, card: derivatives.generateDerivativeCard({ key: 'frost_hazard' }) }),
    }))
  }
}

export const swallow_potion = {
  tableIn: ({ out, into, card }) => {
    const players = [getCurrentPlayer({ index: out.index })]
    const selectableCards = getSelectableCards({ card, players })
    const numbers = Math.min(selectableCards.length, 1)
    store.dispatch(actions.selectingSpecific({ card, players, holderTypes: ['fighter', 'archer', 'thrower'], selectableCards, numbers }))
  },
  specific: ({ specificCards }) => {
    specificCards.forEach(card => boost({ card, value: 8 }))
  }
}

export const muzzle = {
  tableIn: ({ out, into, card }) => {
    const players = [getNextPlayer({ index: out.index })]
    const selectableCards = getSelectableCards({ card, players }).filter(card => (card.type === 'Silver' || card.type === 'Bronze') && calculate({ card }) <= 8)
    const numbers = Math.min(selectableCards.length, 1)
    store.dispatch(actions.selectingSpecific({ card, players, holderTypes: ['fighter', 'archer', 'thrower'], selectableCards, numbers }))
  },
  specific: ({ card, specificCards }) => {
    const selectedCard = { ...specificCards[0], isSpy: true }
    const index = getIndex({ card: selectedCard })
    const type = findHolderType({ card: selectedCard })

    act({ out: getHolder({ type, index }), into: getHolder({ type, index: getNextPlayer({ index }).index }), card: selectedCard })
  }
}

export const white_frost = {
  tableIn: ({ out, into, card }) => {
    store.dispatch(actions.selectingTo({
      player: getNextPlayer({ index: out.index }),
      holderTypes: ['fighter', 'archer'],
      curriedAction: into => ({ out: { type: 'derivation', index: out.index }, into, card: derivatives.generateDerivativeCard({ key: 'frost_hazard' }) }),
      onSelected: ({ out, into }) => {
        act({ out: { type: 'derivation', index: out.index }, into: getHolder({ type: into.type === 'fighter' ? 'archer' : 'thrower', index: into.index }), card: derivatives.generateDerivativeCard({ key: 'frost_hazard' }) })
      },
    }))
  }
}

export const geralt__igni = {
  deploy: ({ out, card }) => {
    const cards = getCards(getHolder({ type: findHolderType({ card }), index: getNextPlayer({ index: out.index }).index }))
    if (calculatePower({ cards }) >= 25) {
      const highestPointsCard = cards.reduce((acc, card) => (calculate({ card }) < calculate({ card: acc }) ? card : acc), cards[0])
      const highestPointsCards = cards.filter(card => calculate({ card }) === calculate({ card: highestPointsCard }))
      highestPointsCards.forEach(card => destroy({ card }))
    }
  }
}
