export const specials = {
  eredin: {
    isDoomed: true,
  },
  frightener: {
    isDoomed: true,
  },
  emhyr_var_emreis: {
    isDoomed: true,
  },
  vicovaro_medic: {
    isDoomed: true,
  },
}

export const common = card => ({
  boosted: 0,
  strengthened: 0,
  isSpy: card.loyalty === 'Disloyal',
})
