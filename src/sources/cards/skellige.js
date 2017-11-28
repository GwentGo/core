import { store } from '../store'
import * as actions from '../../actions'
import { getPlayers, toggleTurn, getCurrentPlayer, getIndex, getSelectableCards, demage } from '../../utils'

export const clan_brokvar_archer = {
  tableIn: action => {
    const { card } = action
    const players = getPlayers()

    const selectableCards = getSelectableCards({ card, players })
    if (selectableCards.length === 0) {
      toggleTurn({ currentPlayer: getCurrentPlayer({ index: getIndex({ card }) }) })
    } else {
      store.dispatch(actions.selectingSpecific({ card, players, holders: ['fighter', 'archer', 'thrower'], numbers: Math.min(3, selectableCards.length) }))
    }
  },
  specific: ({ card, specificCards }) => {
    specificCards.forEach(card => demage({ card, value: 1 }))
    toggleTurn({ currentPlayer: getCurrentPlayer({ index: getIndex({ card }) }) })
  }
}
