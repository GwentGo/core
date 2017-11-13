import { Subject } from 'rxjs/Subject';

import * as cards from './cards'

export const actionSubject = new Subject()
export const weatherSubject = new Subject()
export const roundSubject = new Subject()

export const subscribeActionSubject = () => {
  actionSubject.subscribe(action => {
      const {out, into, card} = action

      if (cards[card.name]) {
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
    }
  )
}
