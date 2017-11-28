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
    const currentPlayer = getCurrentPlayer({ index: out.index })
    const players = [currentPlayer]

    const selectableCards = getSelectableCards({ card, players })
    if (selectableCards.length === 0) {
      toggleTurn({ currentPlayer })
    } else {
      store.dispatch(actions.selectingSpecific({ card, players, holders: ['fighter', 'archer', 'thrower'], numbers: Math.min(1, selectableCards.length) }))
    }

    act({ out: into, into: getHolder({ type: 'tomb', index: out.index }), card })
  },
  specific: ({ card, specificCards }) => {
    specificCards.forEach(card => boost({ card, value: 8 }))
    toggleTurn({ currentPlayer: getCurrentPlayer({ index: getIndex({ card }) }) })
  }
}
