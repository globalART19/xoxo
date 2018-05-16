import inquirer from 'inquirer'

import gameReducer, { move } from './game'
import { createStore } from 'redux'
import aiTurn from './game/ai'

const printBoard = () => {
  const { board } = game.getState()
  for (let r = 0; r != 3; ++r) {
    for (let c = 0; c != 3; ++c) {
      process.stdout.write(board.getIn([r, c], '_'))
    }
    process.stdout.write('\n')
  }
}

const getInput = player => async () => {
  const { turn } = game.getState()
  if (turn !== player) return
  if (player === 'X') {
    const ans = await inquirer.prompt([{
      type: 'input',
      name: 'coord',
      message: `${turn}'s move (row,col):`
    }])
    const [row = 0, col = 0] = ans.coord.split(/[,\s+]/).map(x => +x)
    game.dispatch(move(turn, [row, col]))
  } else {
    game.dispatch(aiTurn(game.getState()))
  }
}

// Create the store
const game = createStore(gameReducer)

// Debug: Print the state
// game.subscribe(() => console.log(game.getState()))

game.subscribe(printBoard)
game.subscribe(getInput('X'))
game.subscribe(getInput('O'))
game.subscribe(() => {
  const { winner: result } = game.getState()
  result === 'draw' ? process.stdout.write(`Cat's Game\n`) && process.exit(0) : result !== 'ongoing' && process.stdout.write(`Player ${result} wins!!!\n`) && process.exit(0)
});
game.subscribe(() => {
  const { error } = game.getState();
  if (error) {
    process.stderr.write(error + '\n');
  }
});

// We dispatch a dummy START action to call all our
// subscribers the first time.
game.dispatch({ type: 'START' })
