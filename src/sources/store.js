import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import Rx from 'rxjs/Rx' // TODO: Import needed only

import reducer from '../reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))

const makeStoreObservable = store => Rx.Observable.create(observer => store.subscribe(() => observer.next(store.getState())))

export const storeObservable = makeStoreObservable(store)
