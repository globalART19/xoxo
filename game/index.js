import { Map } from 'immutable'

//Action Types
const MOVE = 'MOVE'

const initialState = {
  turn: 'X',
  board: Map()
}

// Action Creators
export const move = (turn, position) => {
  return { type: MOVE, position }
}

export default function reducer(state = initialState, action) {
  if (action.type === MOVE) {
    return {
      turn: (state.turn === 'X' ? 'O' : 'X'),
      board: state.board.setIn(action.position, state.turn)
    }
  }
  return state
}