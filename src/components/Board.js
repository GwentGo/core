import React, { Component } from 'react'

import Controller from '../controller/Board'

class Board extends Component {
  state = {
    board: new Controller()
  }

  render() {
    const { board } = this.state

    return (
      <div>
        {Object.keys(board.player).map(key => {
          const player = board.player[key]
          const rate = (player.win / (player.win + player.lose)).toFixed(2)
          return (
            <div key={key}>
              <h3>{player.name}</h3>
              <p>Win: {player.win}, Lose: {player.lose}, Rate: {rate * 100}%</p>
              <hr />
            </div>
          )
        })}
      </div>
    )
  }
}

export default Board
