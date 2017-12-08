import { store } from '../store'
import * as actions from '../../actions'
import { getPlayers, getSelectableCards, demage } from '../../utils'

export const clan_brokvar_archer = {
  deploy: ({ card }) => {
    const players = getPlayers()
    const selectableCards = getSelectableCards({ card, players })
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 3) }))
  },
  specific: ({ specificCards }) => {
    specificCards.forEach(card => demage({ card, value: 1 }))
  }
}
