export const specials = {
  eredin: {
    isDoomed: true,
  },
  frightener: {
    isDoomed: true,
  },
  emhyr_var_emreis: {
    isDoomed: true,
  }
}

export const common = card => ({
  boosted: 0,
  strengthened: 0,
  isSpy: card.loyalty === 'Disloyal',
})
