import idMapping from '../cards/cardIdMapping.json'
import Cards from '../cards/cards.json'

const cardWeight = ["Bronze", "Silver", "Gold"]
const cardSortBy = (a, b) => {
  if (a.type === b.type) {
    if (a.power > b.power) {
      return 1
    } else if (a.power < b.power) {
      return -1
    } else {
      if (a.name > b.name) {
        return 1
      } else if (a.name > b.name) {
        return -1
      } else {
        return 0
      }
    }
  } else {
    return cardWeight.indexOf(a.type) > cardWeight.indexOf(b.type) ? -1 : 1
  }
}

const exportDeck = (leader, goldenCards, silverCards, bronzeCards) => {
  return [leader].concat(goldenCards).concat(silverCards).concat(bronzeCards).map((card) => {
    return Object.keys(idMapping).find((id) => { return idMapping[id] === card.key })
  }).join("#")
}

const validateDeck = (leader, goldCards, silverCards, bronzeCards, checkLowerBound = true) => {
  if (checkLowerBound) {
    if (goldCards.length + silverCards.length + bronzeCards.length < 25) return false
  }

  if (!leader || leader.type !== "Leader") return false

  if (goldCards.length + silverCards.length + bronzeCards.length > 40) return false
  if (goldCards.length > 4) return false
  if (silverCards.length > 6) return false
  const bronzeCardCount = bronzeCards.reduce((obj, card) => {
    obj[card.key] ? obj[card.key] += 1 : obj[card.key] = 1
    return obj
  }, {})
  if (Object.values(bronzeCardCount).filter((count) => { return count > 3 }).length > 0) {
    return false
  }
  const faction = leader.faction
  let isValid = true
  goldCards.concat(silverCards).concat(bronzeCards).forEach((card) => {
    if (card.faction !== faction && card.faction !== "Neutral") isValid = false
  })
  return isValid
}

const importDeck = (deckString) => {
  const cardIds = deckString.split("#")
  let leader, goldCards = [], silverCards = [], bronzeCards = []
  cardIds.forEach((id) => {
    let cardKey = idMapping[id]
    let card = Cards[cardKey]
    switch(card.type) {
    case "Gold":
      goldCards.push(card)
      break
    case "Silver":
      silverCards.push(card)
      break
    case "Bronze":
      bronzeCards.push(card)
      break
    case "Leader":
      leader = card
      break
    default:
      break
    }
  })
  return [leader, goldCards.sort(cardSortBy), silverCards.sort(cardSortBy), bronzeCards.sort(cardSortBy)]
}

export {exportDeck, importDeck, validateDeck, cardSortBy}
