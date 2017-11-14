import uuid from 'uuid/v4'

export const decks = [{
  id: uuid(),
  index: 0,
  type: 'deck',
}, {
  id: uuid(),
  index: 1,
  type: 'deck',
}]

export const hands = [{
  id: uuid(),
  index: 0,
  type: 'hand',
}, {
  id: uuid(),
  index: 1,
  type: 'hand',
}]

export const fighters = [{
  id: uuid(),
  index: 0,
  type: 'fighter',
  weather: null,
}, {
  id: uuid(),
  index: 1,
  type: 'fighter',
  weather: null,
}]

export const archers = [{
  id: uuid(),
  index: 0,
  type: 'archer',
  weather: null,
}, {
  id: uuid(),
  index: 1,
  type: 'archer',
  weather: null,
}]

export const throwers = [{
  id: uuid(),
  index: 0,
  type: 'thrower',
  weather: null,
}, {
  id: uuid(),
  index: 1,
  type: 'thrower',
  weather: null,
}]

export const pickings = [{
  id: uuid(),
  index: 0,
  type: 'picking',
}, {
  id: uuid(),
  index: 1,
  type: 'picking',
}]

export const tombs = [{
  id: uuid(),
  index: 0,
  type: 'tomb',
}, {
  id: uuid(),
  index: 1,
  type: 'tomb',
}]

export const tables = [{
  id: uuid(),
  index: 0,
  type: 'table',
}, {
  id: uuid(),
  index: 1,
  type: 'table',
}]
