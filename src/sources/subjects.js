import { Subject } from 'rxjs/Subject'

import * as cards from './cards'
import { store } from '../sources/store'
import * as actions from '../actions'
import { calculate, getPlayers, getTableCards, calculatePoints, getHolder, getCards, demage } from '../utils'

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

    if (cards[card.key]) {
      const outFunction = cards[card.key][`${out.type}Out`]
      outFunction && outFunction(action)

      let intoFunction = null
      if (['fighter', 'archer', 'thrower'].indexOf(into.type) !== -1) {
        intoFunction = cards[card.key]['tableIn']
      } else {
        intoFunction = cards[card.key][`${into.type}In`]
      }
      intoFunction && intoFunction(action)
    }
  })

  actionSubject.subscribe(() => {
    getPlayers().forEach(player => {
      store.dispatch(actions.updatePlayer({ ...player, power: calculate({ cards: getTableCards({ index: player.index }) }) }))
    })
  })
}

export const subscribeWeatherSubject = () => {
  weatherSubject.subscribe(weather => {
    weather.holder.weather = weather.card ? weather : null

    if (weather.card && weather.card.key === 'frost_hazard') {
      getTableCards({}).forEach(card => {
        if (card.key === 'ice_giant' && !card.hasFrostHazardBoosted) {
          card.boosted += 6
          card.hasFrostHazardBoosted = true
        }
      })
    }
  })
}

export const subscribeTurnSubject = () => {
  turnSubject.subscribe(({ player }) => {
    ['fighter', 'archer', 'thrower'].forEach(holderType => {
      const holder = getHolder({ type: holderType, index: player.index })
      if (holder.weather && holder.weather.card.key === 'frost_hazard') {
        const cards = getCards({ type: holderType, index: player.index })
        if (cards.length > 0) {
          const lowestPointsCard = cards.reduce((acc, card) => (calculatePoints({ card }) < calculatePoints({ card: acc }) ? card : acc), cards[0])
          demage({ card: lowestPointsCard, value: 2 })
        }
      }
    })
  })
}
