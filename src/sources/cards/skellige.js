import { store } from '../store'
import * as actions from '../../actions'
import { getPlayers, getSelectableCards, demage } from '../../utils'

export const clan_brokvar_archer = {
  tableIn: ({ card }) => {
    const players = getPlayers()
    const selectableCards = getSelectableCards({ card, players })
    const numbers = Math.min(selectableCards.length, 3)
    store.dispatch(actions.selectingSpecific({ card, players, holders: ['fighter', 'archer', 'thrower'], numbers }))
  },
  specific: ({ specificCards }) => {
    specificCards.forEach(card => demage({ card, value: 1 }))
  }
}
