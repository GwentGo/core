import uuid from 'uuid/v4'

import { weatherSubject, roundSubject } from './subjects'

export const getDerivativeCard = ({ name }) => ({
  id: uuid(),
  row: 'Special',
  name,
})

export const frost_hazard = {
  tableIn: action => {
    weatherSubject.next({ holder: action.into, card: action.card })
    roundSubject.next({ hasDone: true })
  }
}
