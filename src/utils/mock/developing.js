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
  "geralt":{
    "factoin":"Neutral",
    "power":13,
    "row":"Any",
    "type":"Gold",
    "name_en":"Geralt",
    "abilities_en":"No ability."
  },
  "caranthir":{
    "factoin":"Monsters",
    "power":8,
    "row":"Any",
    "type":"Gold",
    "name_en":"Caranthir",
    "abilities_en":"Deploy: Move an Enemy to this row on its side and apply a Frost Hazard to that row.",
    "rarity":"Legendary",
    "loyalty":"Loyal",
    "attributes":[
      "Wild Hunt",
      "Mage",
      "Officer"
    ]
  },
  "royal_decree":{
    "factoin":"Neutral",
    "power":0,
    "row":"Special",
    "type":"Gold",
    "name_en":"Royal Decree",
    "abilities_en":"Play a Gold card from your Deck. If it is a Unit (but not an Agent or Double Agent), Boost it by 2. Shuffle the others back.",
    "rarity":"Legendary",
    "loyalty":"",
    "attributes":[
      "Special",
      "Tactic"
    ]
  },
  "commander_s_horn":{
    "factoin":"Neutral",
    "power":0,
    "row":"Special",
    "type":"Silver",
    "name_en":"Commander's Horn",
    "abilities_en":"Boost 5 adjacent Units by 4.",
    "rarity":"Epic",
    "loyalty":"",
    "attributes":[
      "Special",
      "Tactic"
    ]
  },
  "cleaver":{
    "factoin":"Neutral",
    "power":9,
    "row":"Any",
    "type":"Silver",
    "name_en":"Cleaver",
    "abilities_en":"Deploy: Toggle a Unit's Lock.",
    "rarity":"Epic",
    "loyalty":"Loyal",
    "attributes":[
      "Dwarf"
    ]
  },
  "drowner":{
    "factoin":"Monsters",
    "power":7,
    "row":"Any",
    "type":"Bronze",
    "name_en":"Drowner",
    "abilities_en":"Deploy: Move a Unit to this row on its side. If it's an Enemy, Damage it by 2. If the Enemy is under any Hazard after being moved, Damage it by 4 instead.",
    "rarity":"Common",
    "loyalty":"Loyal",
    "attributes":[
      "Necrophage"
    ]
  },
  "wild_hunt_longship":{
    "factoin":"Monsters",
    "power":7,
    "row":"Any",
    "type":"Bronze",
    "name_en":"Wild Hunt Longship",
    "abilities_en":"While on the Board, Boost all other Wild Hunt Allies by 1. When Destroyed or Locked, Damage all other Wild Hunt Allies by 1.",
    "rarity":"Rare",
    "loyalty":"Loyal",
    "attributes":[
      "Machine",
      "Wild Hunt"
    ]
  },
  "ice_giant":{
    "factoin":"Monsters",
    "power":6,
    "row":"Any",
    "type":"Bronze",
    "name_en":"Ice Giant",
    "abilities_en":"If a Frost Hazard is anywhere on the Board, Boost self by 6.",
    "rarity":"Rare",
    "loyalty":"Loyal",
    "attributes":[
      "Ogroid"
    ]
  },
  "wild_hunt_rider":{
    "factoin":"Monsters",
    "power":9,
    "row":"Any",
    "type":"Bronze",
    "name_en":"Wild Hunt Rider",
    "abilities_en":"Increase by 1 the Damage dealt by Frost Hazards on the opposite row.",
    "rarity":"Common",
    "loyalty":"Loyal",
    "attributes":[
      "Soldier",
      "Wild Hunt"
    ]
  },
  "wild_hunt_warrior":{
    "factoin":"Monsters",
    "power":6,
    "row":"Any",
    "type":"Bronze",
    "name_en":"Wild Hunt Warrior",
    "abilities_en":"Deploy: Damage an Enemy by 3. If it was under a Frost Hazard or Destroyed, Boost self by 2.",
    "rarity":"Common",
    "loyalty":"Loyal",
    "attributes":[
      "Soldier",
      "Wild Hunt"
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
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'ice_giant',
  ...originalCards['ice_giant'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'ice_giant',
  ...originalCards['ice_giant'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'ice_giant',
  ...originalCards['ice_giant'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'wild_hunt_rider',
  ...originalCards['wild_hunt_rider'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'wild_hunt_rider',
  ...originalCards['wild_hunt_rider'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'wild_hunt_rider',
  ...originalCards['wild_hunt_rider'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'drowner',
  ...originalCards['drowner'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'drowner',
  ...originalCards['drowner'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'drowner',
  ...originalCards['drowner'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'wild_hunt_warrior',
  ...originalCards['wild_hunt_warrior'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'wild_hunt_warrior',
  ...originalCards['wild_hunt_warrior'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'wild_hunt_warrior',
  ...originalCards['wild_hunt_warrior'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'commander_s_horn',
  ...originalCards['commander_s_horn'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'royal_decree',
  ...originalCards['royal_decree'],
}, {
  id: uuid(),
  deckIndex: 0,
  name: 'cleaver',
  ...originalCards['cleaver'],
}]

const cards2 = [{
  id: uuid(),
  deckIndex: 1,
  name: 'eredin',
  ...originalCards['eredin'],
}]

export default cards1.concat(cards2)
