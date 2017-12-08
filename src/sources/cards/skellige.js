import { store } from '../store'
import * as actions from '../../actions'
import { getPlayers, getAvailableCards, demage } from '../../utils'

export const clan_brokvar_archer = {
  deploy: ({ card }) => {
    const players = getPlayers()
    const selectableCards = getAvailableCards({ card, players })
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 3) }))
  },
  specific: ({ specificCards }) => {
    specificCards.forEach(card => demage({ card, value: 1 }))
  }
}
