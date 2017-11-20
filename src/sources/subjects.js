import { Subject } from 'rxjs/Subject'

import * as cards from './cards'
import { store } from '../sources/store'
import * as actions from '../actions'
import { calculate, getPlayers, getTableCards } from '../utils'

// action = { out, into, card }
export const actionSubject = new Subject()

// weather = { holder, card }
export const weatherSubject = new Subject()

// turn = { player }
export const turnSubject = new Subject()

// round = { sequence }
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

  actionSubject.subscribe(() => {
    getPlayers().forEach(player => {
      store.dispatch(actions.updatePlayer({ ...player, power: calculate(getTableCards({ index: player.index })) }))
    })
  })
}

export const subscribeWeatherSubject = () => {
  weatherSubject.subscribe(weather => {
    weather.holder.weather = weather.card ? weather : null

    if (weather.card && weather.card.name === 'frost_hazard') {
      getTableCards({}).forEach(card => {
        if (card.name === 'ice_giant' && !card.points.hasFrostHazardIncreased) {
          card.points.increased += 6
          card.points.hasFrostHazardIncreased = true
        }
      })
    }
  })
}

export const subscribeTurnSubject = () => {
  turnSubject.subscribe(turn => {
    console.log(turn.player)
  })
}
