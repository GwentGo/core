import { store } from '../store'
import * as actions from '../../actions'
import { getPlayers, toggleTurn, getCurrentPlayer, getIndex, getSelectableCards, demage } from '../../utils'

export const clan_brokvar_archer = {
  tableIn: action => {
    const { card } = action

    const players = getPlayers()
    const selectableCards = getSelectableCards({ card, players })
    const numbers = Math.min(selectableCards.length, 3)
    store.dispatch(actions.selectingSpecific({ card, players, holders: ['fighter', 'archer', 'thrower'], numbers }))
  },
  specific: ({ card, specificCards }) => {
    specificCards.forEach(card => demage({ card, value: 1 }))
    toggleTurn({ currentPlayer: getCurrentPlayer({ index: getIndex({ card }) }) })
  }
}
