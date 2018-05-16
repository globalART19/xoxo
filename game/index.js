import { Map } from 'immutable'

//Action Types
const MOVE = 'MOVE'

const initialState = {
  turn: 'X',
  board: Map()
}

const streak = (board, firstCoord, ...remainingCoords) => {
  const firstEntry = board.getIn(firstCoord);
  if (firstEntry === undefined) return null;

  const count = remainingCoords.reduce((acc, coord) => {
    if (firstEntry === board.getIn(coord)) {
      return acc + 1
    }
  }, 0)

  return count === 2 ? firstEntry : null;
}

const winner = (board) => {
  let winner = null;

  for (let row = 0; row < 3; row++) {
    winner = streak(board, [row, 0], [row, 1], [row, 2])
    if (winner) return winner;
  }

  for (let col = 0; col < 3; col++) {
    winner = streak(board, [0, col], [1, col], [2, col])
    if (winner) return winner;
  }

  winner = streak(board, [0, 0], [1, 1], [2, 2])
  if (winner) return winner;

  winner = streak(board, [0, 2], [1, 1], [2, 0])

  if (winner) {
    return winner;
  } else {
    for (let i = 0; i < 3; i++) {
      for (let j=0; j < 3; j++) {
        if (!Map.getIn([i, j])) return 'ongoing';
      }
    }
  }

  return 'draw';
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
