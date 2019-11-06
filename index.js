const axios = require('axios')
const opn = require('opn')
const BASE_URL = 'http://393d049b.ngrok.io'
const GUI_URL = 'https://tetris.picante.monster'
const { PIECE_MASK, PIECE_MASK_90, PIECE_MASK_180, PIECE_MASK_270, transformMask} = require('./pieces.js')

;(function () {
  let gameId = process.env.GAME_ID
  async function run() {
      if (!gameId) {
          gameId = await createGame()
      }
      let state = await joinGame()
      openBrowser()
      while (true) {
        const piece = PIECE_MASK_90[state.current_piece]
        console.log([...getBoard(state)].reverse())
        console.log(state.current_piece, nextOffset(getBoard(state), piece))
        state = await placePiece({...state, pieceMask: piece}, nextOffset(getBoard(state), piece), gameId)
      }
  }

  function openBrowser () {
    if (process.env.BROWSER) {
      opn(`${GUI_URL}`)
    }
  }

  function nextOffset(board, currentPiece) {
      for (let row = 0; row < board.length; row++) {
          for (let col = 0; col < board[row].length; col++) {
              if (validateMove(currentPiece, board, { row, col })) {
                  return {
                      row,
                      col
                  }
              }
          }
      }
  }

  function validateMove(pieceMask, board, offset) {
    const height = board.length
    const width = board[0].length
    for (let y = 0; y < pieceMask.length; y++) {
      for (let x = 0; x < pieceMask[y].length; x++) {
        if (pieceMask[y][x]) {
          const posX = offset.col + x
          const posY = offset.row + y
          if (posX >= width) return false
          if (posY >= height) return false
          if (board[posY][posX]) return false
          for (let yPrime = posY; yPrime < height; yPrime++) {
            if (board[yPrime][posX]) return false
          }
        }
      }
    }
    return true
  }
  
  function getBoard({players, playerId}) {
    return players.find(p => p.id === playerId).board
  }

  async function joinGame() {
    const games = ['YOUR MOM', 'BOO MIKE', 'YOU\'RE GOING DOWN', 'ROBOTRON', "TREELON MUSK"]
      const resp = await axios.post(`${BASE_URL}${gameId}/players`, {
          name: games[Math.floor(Math.random() * (games.length - 0) + 0)]
      })
      return {
          ...resp.data,
          nextTurnToken: resp.headers['x-turn-token'],
          playerId: resp.headers['x-player-id']
      }
  }

  async function createGame() {
      const resp = await axios.post(BASE_URL, 
        {
          "seats": 1,
          "turns": 100,
          "initial_garbage": 0
        })
      return resp.headers.location
  }

  async function placePiece({current_piece, nextTurnToken, playerId, pieceMask}, offset, gameId) {
    console.log(current_piece)
    const resp = await axios.post(`${BASE_URL}${gameId}/moves`, {
      locations: transformOffset(pieceMask, offset)
    }, { headers: { 'x-turn-token': nextTurnToken }})
    return {
        ...resp.data,
        nextTurnToken: resp.headers['x-turn-token'],
        playerId 
    }
  }

  function transformOffset(piece, offset) {
      return transformMask(piece).map(l => ({ row: l.row + offset.row, col: l.col + offset.col }))
  }

  function rotate(piece) {
       const reversed = [...piece].reverse()
       // swap the symmetric elements
       for (var i = 0; i < reversed.length; i++) {
         for (var j = 0; j < i; j++) {
           var temp = reversed[i][j];
           reversed[i][j] = reversed[j][i];
           reversed[j][i] = temp;
         }
       }
       console.log(reversed)
       return reversed
  }


  run().then(() => console.log('finished')).catch(err => console.log(err))
})();