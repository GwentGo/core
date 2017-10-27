import React, { Component } from 'react'

import BoardController from '../controller/Board'
import Card from './Card'

class Board extends Component {
  state = {
    board: new BoardController()
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
              <p>Deck: {player.deck.cards.length}</p>
              {player.deck.cards.map(card => (
                <Card key={card.name} card={card} />
              ))}
              <hr />
            </div>
          )
        })}
      </div>
    )
  }
}

export default Board
