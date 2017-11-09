import uuid from 'uuid/v4'

import originalCards from '../utils/originalCards'
import { store } from './store'
import * as actions from '../actions'
import { weatherSubject, roundSubject } from './subjects'

export const eredin = {
  tableIn: action => {
    const associationCards = originalCards.filter(card => card.name.indexOf('wild_hunt') !== -1 && card.type === 'Bronze')

    store.dispatch(actions.addCards(associationCards.map(card => ({
      id: uuid(),
      pickingIndex: action.into.index,
      ...card,
    }))))
  }
}

export const wild_hunt_hound = {
  tableIn: action => {
    // store.dispatch(actions.updateCard({ ...action.card,  }))
  }
}

export const ice_giant = {
  tableIn: action => {
    weatherSubject.subscribe(() => {
      console.log('weather happens')
    })
    roundSubject.next({ hasDone: true })
  }
}

export const biting_frost = {
  tableIn: action => {
    console.log('sss');
  }
}
