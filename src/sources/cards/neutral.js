import { store } from '../store'
import * as actions from '../../actions'
import { getNextPlayer, act, getHolder, getCurrentPlayer, boost, getSelectableCards, getIndex, findHolderType } from '../../utils'
import * as derivatives from './derivatives'

export const biting_frost = {
  tableIn: ({ out, into, card }) => {
    store.dispatch(actions.selectingTo({
      player: getNextPlayer({ index: out.index }),
      holders: ['fighter', 'archer', 'thrower'],
      curriedAction: into => ({ out: { index: out.index, type: 'derivation' }, into, card: derivatives.getDerivativeCard({ key: 'frost_hazard' }) }),
    }))

    act({ out: into, into: getHolder({ type: 'tomb', index: out.index }), card })
  }
}

export const swallow_potion = {
  tableIn: ({ out, into, card }) => {
    const players = [getCurrentPlayer({ index: out.index })]
    const selectableCards = getSelectableCards({ card, players })
    const numbers = Math.min(selectableCards.length, 1)
    store.dispatch(actions.selectingSpecific({ card, players, holders: ['fighter', 'archer', 'thrower'], numbers }))

    act({ out: into, into: getHolder({ type: 'tomb', index: out.index }), card })
  },
  specific: ({ specificCards }) => {
    specificCards.forEach(card => boost({ card, value: 8 }))
  }
}

export const muzzle = {
  tableIn: ({ out, into, card }) => {
    const players = [getNextPlayer({ index: out.index })]
    const selectableCards = getSelectableCards({ card, players })
    const numbers = Math.min(selectableCards.length, 1)
    store.dispatch(actions.selectingSpecific({ card, players, holders: ['fighter', 'archer', 'thrower'], numbers }))

    act({ out: into, into: getHolder({ type: 'tomb', index: out.index }), card })
  },
  specific: ({ card, specificCards }) => {
    const selectedCard = specificCards[0]

    store.dispatch(actions.selectingTo({
      player: getNextPlayer({ index: getIndex({ card }) }),
      holders: ['fighter', 'archer', 'thrower'],
      curriedAction: into => ({ out: { index: getIndex({ selectedCard }), type: findHolderType({ card: selectedCard }) }, into, card: selectedCard })
    }))
  }
}
