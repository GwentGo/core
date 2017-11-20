import uuid from 'uuid/v4'

import { weatherSubject } from './subjects'
import { toggleTurn, getCurrentPlayer } from '../utils'

export const getDerivativeCard = ({ name }) => ({
  id: uuid(),
  row: 'Special',
  name,
})

export const frost_hazard = {
  tableIn: action => {
    const { out, into, card } = action

    weatherSubject.next({ holder: into, card: card })
    toggleTurn({ currentPlayer: getCurrentPlayer({ index: out.index }) })
  }
}
