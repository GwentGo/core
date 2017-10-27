import React, { Component } from 'react'
import Grid from 'material-ui/Grid'

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

              <div tag="player-info">
                <h3>{player.name}</h3>
                <p>Win: {player.win}, Lose: {player.lose}, Rate: {rate * 100}%</p>
              </div>

              <div tag="deck-info">
                <p>Deck: {player.deck.cards.length}</p>
                <Grid container>
                  {player.deck.cards.map(card => (
                    <Grid key={card.name} item>
                      <Card card={card} />
                    </Grid>
                  ))}
                </Grid>
              </div>

              <div tag="hand-info">
                <p>Hand: {player.hand.cards.length}</p>
                <Grid container>
                  {player.hand.cards.map(card => (
                    <Grid key={card.name} item>
                      <Card card={card} />
                    </Grid>
                  ))}
                </Grid>
              </div>

              <br />
              <hr />
            </div>
          )
        })}
      </div>
    )
  }
}

export default Board
