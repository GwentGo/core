import { store } from '../store'
import * as actions from '../../actions'
import { getPlayers, demage, getCards } from '../../utils'

export const clan_brokvar_archer = {
  deploy: ({ card }) => {
    const players = getPlayers()
    const selectableCards = getCards({ players })
    store.dispatch(actions.selectingSpecific({ card, players, selectableCards, numbers: Math.min(selectableCards.length, 3) }))
  },
  specific: ({ selectedCards }) => {
    selectedCards.forEach(card => demage({ card, value: 1 }))
  }
}
