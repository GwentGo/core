import Random from 'random-js'

export const getRandomCards = (cards, options = {numbers: 10}) => {
  const arr = []

  for (let i = 0; i < options.numbers; i++) {
    const randomIndex = new Random().integer(0, cards.length - 1)
    if (cards[randomIndex]) {
      arr.push(cards[randomIndex])
      cards = cards.slice(0, randomIndex).concat(cards.slice(randomIndex + 1))
    }
  }
  return arr
}
