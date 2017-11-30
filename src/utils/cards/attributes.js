export const specials = {
  eredin: {
    isDoomed: true,
  }
}

export const common = card => ({
  boosted: 0,
  strengthened: 0,
  isSpy: card.loyalty === 'Disloyal',
})
