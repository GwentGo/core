import { store } from '../store'
import * as actions from '../../actions'
import { getNextPlayer, act, getHolder } from '../../utils'
import * as derivatives from './derivatives'

export const biting_frost = {
  tableIn: action => {
    const { out, into, card } = action

    store.dispatch(actions.selectingTo({
      player: getNextPlayer({ index: out.index }),
      holders: ['fighter', 'archer', 'thrower'],
      curriedAction: into => ({ out: { index: out.index, type: 'derivation' }, into, card: derivatives.getDerivativeCard({ key: 'frost_hazard' }) }),
    }))

    act({ out: into, into: getHolder({ type: 'tomb', index: out.index }), card })
  }
}
