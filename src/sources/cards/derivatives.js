import uuid from 'uuid/v4'

import { weatherSubject } from '../subjects'
import { act } from '../../utils'

export const getDerivativeCard = ({ key }) => ({
  id: uuid(),
  row: 'Special',
  key,
})

export const frost_hazard = {
  tableIn: ({ out, into, card }) => {
    weatherSubject.next({ holder: into, card: card })
    act({ out: into, into: null, card })
  }
}
