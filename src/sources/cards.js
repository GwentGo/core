import uuid from 'uuid/v4'

import originalCards from '../utils/originalCards'
import { store } from './store'
import * as actions from '../actions'
import { roundSubject } from './subjects'
import { getNextPlayerByIndex } from '../utils/helpers'
import * as derivativeCards from './derivativeCards'

export const { frost_hazard } = derivativeCards

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
    // check if any holder has weather
    roundSubject.next({ hasDone: true })
  }
}

export const biting_frost = {
  tableIn: action => {
    const { out, into, card } = action

    store.dispatch(actions.receiveSelectingTo({
      player: getNextPlayerByIndex(out.index),
      holders: ['fighter', 'archer', 'thrower'],
      curriedAction: into => ({ out: { index: out.index, type: 'derivation' }, into, card: derivativeCards.getDerivativeCardByName('frost_hazard') }),
    }))

    store.dispatch(actions.updateCard({...card, [`${into.type}Index`]: '', [`tombIndex`]: into.index }))
  }
}
