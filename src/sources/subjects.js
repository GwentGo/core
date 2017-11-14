import { Subject } from 'rxjs/Subject';

import * as cards from './cards'

// action = { out, into, card }
export const actionSubject = new Subject()

// weather = { holder, card }
export const weatherSubject = new Subject()

// round = { hasDone: true }
export const roundSubject = new Subject()

export const subscribeActionSubject = () => {
  actionSubject.subscribe(action => {
    const { out, into, card } = action

    if (cards[card.name]) {
      const outFunction = cards[card.name][`${out.type}Out`]
      outFunction && outFunction(action)

      let intoFunction = null
      if (['fighter', 'archer', 'thrower'].indexOf(into.type) !== -1) {
        intoFunction = cards[card.name]['tableIn']
      } else {
        intoFunction = cards[card.name][`${into.type}In`]
      }
      intoFunction && intoFunction(action)
    }
  })
}

export const subscribeWeatherSubject = () => {
  weatherSubject.subscribe(weather => {
    weather.holder.weather = weather.card ? weather : null
  })
}
