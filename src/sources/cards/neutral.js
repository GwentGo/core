import { store } from '../store'
import * as actions from '../../actions'
import { getNextPlayer, act, getHolder, getCurrentPlayer, boost, getSelectableCards, toggleTurn, getIndex } from '../../utils'
import * as derivatives from './derivatives'

export const biting_frost = {
  tableIn: action => {
    const { out, into, card } = action

    store.dispatch(actions.selectingTo({
      player: getNextPlayer({ index: out.index }),
      holders: ['fighter', 'archer', 'thrower'],
      curriedAction: into => ({ out: { index: out.index, type: 'derivation' }, into, card: derivatives.getDerivativeCard({ key: 'frost_hazard' }) }),
    }))

    act({ out: into, into: getHolder({ type: 'tomb', index: out.index }), card })
  }
}

export const swallow_potion = {
  tableIn: action => {
    const { out, into, card } = action

    const players = [getCurrentPlayer({ index: out.index })]
    const selectableCards = getSelectableCards({ card, players })
    const numbers = Math.min(selectableCards.length, 1)
    store.dispatch(actions.selectingSpecific({ card, players, holders: ['fighter', 'archer', 'thrower'], numbers }))

    act({ out: into, into: getHolder({ type: 'tomb', index: out.index }), card })
  },
  specific: ({ card, specificCards }) => {
    specificCards.forEach(card => boost({ card, value: 8 }))
    toggleTurn({ currentPlayer: getCurrentPlayer({ index: getIndex({ card }) }) })
  }
}
