import Random from 'random-js'

import { store } from '../store'
import * as actions from '../../actions'
import { getNextPlayer, act, getHolder, getCurrentPlayer, boost, getIndex, findHolderType, calculate, destroy, getCards, calculatePower } from '../../utils'
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
    const selectableCards = getCards({ players }).filter(c => c.id !== card.id)
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 1) }))
  },
  specific: ({ selectedCards }) => {
    selectedCards.forEach(card => boost({ card, value: 8 }))
  }
}

export const muzzle = {
  tableIn: ({ out, into, card }) => {
    const players = [getNextPlayer({ index: out.index })]
    const selectableCards = getCards({ players }).filter(card => (card.type === 'Silver' || card.type === 'Bronze') && calculate({ card }) <= 8)
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 1) }))
  },
  specific: ({ card, selectedCard }) => {
    const specificCard = { ...selectedCard, isSpy: !selectedCard.isSpy }
    const index = getIndex({ card: specificCard })
    const type = findHolderType({ card: specificCard })

    act({ out: getHolder({ type, index }), into: getHolder({ type, index: getNextPlayer({ index }).index }), card: specificCard })
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
    const cards = getCards({ holder: getHolder({ type: findHolderType({ card }), index: getNextPlayer({ index: out.index }).index }) })
    if (calculatePower({ cards }) >= 25) {
      const highestPointsCard = cards.reduce((acc, card) => (calculate({ card }) < calculate({ card: acc }) ? card : acc), cards[0])
      const highestPointsCards = cards.filter(card => calculate({ card }) === calculate({ card: highestPointsCard }))
      highestPointsCards.forEach(card => destroy({ card }))
    }
  }
}

export const iris = {
  destroyed: ({ out, into, card }) => {
    const cards = getCards({ players: [getNextPlayer({ index: out.index })] })
    const randomCards = new Random().sample(cards, Math.min(cards.length, 5))
    randomCards.forEach(card => boost({ card, value: 5 }))
  }
}
