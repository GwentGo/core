import uuid from 'uuid/v4'

const originalCards = {
  "eredin": {
    "factoin": "Monsters",
    "power": 5,
    "row": "Any",
    "type": "Leader",
    "name_en": "Eredin",
    "abilities_en": "Spawn Eredin.\r\nDeploy: Spawn a Bronze Wild Hunt Unit.",
    "name_cn": "艾瑞汀",
    "abilities_cn": "生成“艾瑞汀”。\r\n部署：生成1个铜色狂猎单位。",
    "rarity": "Legendary",
    "loyalty": "",
    "attributes": []
  },
}

const cards1 = [{
  id: uuid(),
  deckIndex: 0,
  ...originalCards['eredin'],
}]

const cards2 = [{
  id: uuid(),
  deckIndex: 1,
  ...originalCards['eredin'],
}]

export default cards1.concat(cards2)
