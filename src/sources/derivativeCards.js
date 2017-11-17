import uuid from 'uuid/v4'

import { weatherSubject, turnSubject } from './subjects'

export const getDerivativeCard = ({ name }) => ({
  id: uuid(),
  row: 'Special',
  name,
})

export const frost_hazard = {
  tableIn: action => {
    weatherSubject.next({ holder: action.into, card: action.card })
    turnSubject.next({ hasDone: true })
  }
}
