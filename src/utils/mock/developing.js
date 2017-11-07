import uuid from 'uuid/v4'

const originalCards = {
  "eredin":{
    "factoin":"Monsters",
    "power":5,
    "row":"Any",
    "type":"Leader",
    "name_en":"Eredin",
    "abilities_en":"Doomed, Stubborn.\r\nDeploy: Spawn a Bronze Wild Hunt Unit.",
    "rarity":"Legendary",
    "loyalty":"",
    "attributes":[
      "Wild Hunt"
    ]
  },
  "wild_hunt_hound":{
    "factoin":"Monsters",
    "power":4,
    "row":"Any",
    "type":"Bronze",
    "name_en":"Wild Hunt Hound",
    "abilities_en":"Deploy: Play a Biting Frost card from your Deck.",
    "rarity":"Rare",
    "loyalty":"Loyal",
    "attributes":[
      "Construct",
      "Wild Hunt"
    ]
  },
  "biting_frost":{
    "factoin":"Neutral",
    "power":0,
    "row":"Special, Melee, Ranged, Siege",
    "type":"Bronze",
    "name_en":"Biting Frost",
    "abilities_en":"Apply a Frost Hazard to an opposing row.\r\nFrost Hazard: Every turn, at the start of your turn, Damage the Lowest Unit on the row by 2.",
    "rarity":"Common",
    "loyalty":"",
    "attributes":[
      "Special",
      "Hazard"
    ]
  },
}

const cards1 = [{
  id: uuid(),
  deckIndex: 0,
  name: 'eredin',
  ...originalCards['eredin'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'wild_hunt_hound',
  ...originalCards['wild_hunt_hound'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'wild_hunt_hound',
  ...originalCards['wild_hunt_hound'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'wild_hunt_hound',
  ...originalCards['wild_hunt_hound'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'biting_frost',
  ...originalCards['biting_frost'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'biting_frost',
  ...originalCards['biting_frost'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'biting_frost',
  ...originalCards['biting_frost'],
}]

const cards2 = [{
  id: uuid(),
  deckIndex: 1,
  name: 'eredin',
  ...originalCards['eredin'],
}]

export default cards1.concat(cards2)
