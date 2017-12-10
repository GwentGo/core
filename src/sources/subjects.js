import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/interval'

import * as cards from './cards'
import { store } from '../sources/store'
import * as actions from '../actions'
import { calculatePower, getPlayers, calculate, getHolder, getCards, demage, boost, getNextPlayer, syncCardIds, hasDoneSelecting } from '../utils'

// action = { out, into, card }
export const actionSubject = new Subject()

// weather = { holder, card }
export const weatherSubject = new Subject()

// turn = { player }
export const turnSubject = new Subject()

// round = { sequence }
export const roundSubject = new Subject()

// specific = { card, specificCards }
export const specificSubject = new Subject()

// then = { card }
export const thenObservable = Observable.interval(20)

export const timerObservable = Observable.interval(300)

export const subscribeActionSubject = () => {
  actionSubject.subscribe(({ out }) => {
    syncCardIds({ holder: getHolder({ type: 'deck', index: out.index }) })
  })

  actionSubject.subscribe(action => {
    const { out, into, card } = action
    const sourceCard = cards[card.key]

    if (out.type === 'picking') {
      store.dispatch(actions.removeCards(getCards({ holder: getHolder({ type: 'picking', index: out.index }) })))
    }

    if (sourceCard) {
      const outFunction = sourceCard[`${out.type}Out`]
      outFunction && outFunction(action)

      if (into) {
        let intoFunction = null
        if (['fighter', 'archer', 'thrower'].indexOf(into.type) !== -1) {
          intoFunction = sourceCard['tableIn']

          if (['hand', 'deck', 'tomb', 'picking'].indexOf(out.type) !== -1) {
            sourceCard['deploy'] && sourceCard['deploy'](action)

            if (sourceCard['then']) {
              subscribeThenObservable(card)
            }
          }
        } else {
          if (into.type === 'tomb' && ['fighter', 'archer', 'thrower'].indexOf(out.type) !== -1) {
            sourceCard['destroyed'] && sourceCard['destroyed'](action)
          }

          intoFunction = sourceCard[`${into.type}In`]
        }
        intoFunction && intoFunction(action)
      }
    }
  })

  actionSubject.subscribe(() => {
    getPlayers().forEach(player => {
      store.dispatch(actions.updatePlayer({ ...player, power: calculatePower({ cards: getCards({ players: [player] }) }) }))
    })
  })
}

export const subscribeWeatherSubject = () => {
  weatherSubject.subscribe(weather => {
    weather.holder.weather = weather.card ? weather : null

    if (weather.card && weather.card.key === 'frost_hazard') {
      getCards({ players: getPlayers() }).forEach(card => {
        if (card.key === 'ice_giant' && !card.hasFrostHazardBoosted) {
          boost({ card, value: 6 })
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
        const cards = getCards({ holder: getHolder({ type: holderType, index: player.index }) })
        if (cards.length > 0) {
          const nextPlayer = getNextPlayer({ index: holder.index })
          const oppositeCards = getCards({ holder: getHolder({ type: holderType, index: nextPlayer.index }) })
          const wild_hunt_rider = oppositeCards.filter(card => card.key === 'wild_hunt_rider')

          const lowestPointsCard = cards.reduce((acc, card) => (calculate({ card }) < calculate({ card: acc }) ? card : acc), cards[0])
          demage({ card: lowestPointsCard, value: 2 + wild_hunt_rider.length })
        }
      }
    })
  })
}

export const subscribeSpecificSubject = () => {
  specificSubject.subscribe(specific => {
    const specificFunction = cards[specific.card.key]['specific']
    specificFunction && specificFunction(specific)
  })
}

const subscriptions = {}
export const subscribeThenObservable = card => {
  let subscription = subscriptions[card.id]
  subscription = thenObservable.subscribe(() => {
    if (hasDoneSelecting()) {
      subscription.unsubscribe()
      subscription = null

      cards[card.key]['then']({ card })
    }
  })
}
