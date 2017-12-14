import uuid from 'uuid/v4'

import { weatherSubject } from '../subjects'

export const generate = ({ key }) => ({
  id: uuid(),
  key,
  attributes: ['Special', 'derivative']
})

export const frost_hazard = {
  tableIn: ({ out, into, card }) => {
    weatherSubject.next({ holder: into, card: card })
  }
}
