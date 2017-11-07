import Rx from 'rxjs/Rx'

import * as cards from './cards'

export const subject = new Rx.Subject()

export const subscribe = () => {
  subject.subscribe({
    next: action => {
      const {out, into, card} = action

      const outFunction = cards[card.name][`${out.type}Out`]
      outFunction && outFunction(action)

      let inFunction = null
      if (['fighter', 'archer', 'thrower'].indexOf(into.type) !== -1) {
        inFunction = cards[card.name]['tableIn']
      } else {
        inFunction = cards[card.name][`${into.type}In`]
      }
      inFunction && inFunction(action)
    }
  })
}
