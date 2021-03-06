import reducer, { move, badMove, winner, boardReducer } from '.'

/**
 * moves(State) -> [...Action]
 *
 * Return an array of actions which are valid moves from the given state.
 */
export const moves = game => {
  const possibleMoves = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (!badMove(game, move(game.turn, [row, col]))) possibleMoves.push(move(game.turn, [row, col]))
    }
  }
  return possibleMoves
}
/**
 * score(game: State, move: Action) -> Number
 *
 * Given a game state and an action, return a score for how good
 * a move the action would be for the player whose turn it is.
 *
 * Scores will be numbers from -1 to +1. 1 is a winning state, -1
 * is state from which we can only lose.
 */
const score = (game, moveObj) => {
  //winning condition
  //if 2 in a row && 3rd empty, win
  // if (winner(boardReducer(game.board, move('O', position))) === 'O') return 1
  // // losing condition
  // // if opponent 2 in a row && third empty
  // if (winner(boardReducer(game.board, move('X', position))) === 'X') return .99

  const future = reducer(game, moveObj)
  if (future.winner === moveObj.player) return 1
  if (future.winner === 'draw') return 0
  if (!future.winner) return -Math.max(...moves(future).map(move => score(future, moveObj)))
  return -1
}

/**
 * play(state: State) -> Action
 *
 * Return the best action for the current player.
 */
export default state => {
  const possibleMoves = moves(state)
  const scoreArray = possibleMoves.map(move => {
    return score(state, move)
  })
  const sortedArray = [...scoreArray].sort((a, b) => { return b - a })
  const moveIndex = scoreArray.indexOf(sortedArray[0])
  return possibleMoves[moveIndex]
}