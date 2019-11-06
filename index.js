const axios = require('axios')
const opn = require('opn')
const BASE_URL = 'http://393d049b.ngrok.io'
const GUI_URL = 'https://tetris.picante.monster'
const { rotations, transformMask} = require('./pieces.js')
const { cloneDeep, maxBy, minBy } = require('lodash')
;(function () {
  let gameId = process.env.GAME_ID
  async function run() {
      if (!gameId) {
          gameId = await createGame()
      }
      console.log('Game ID', gameId)
      let state = await joinGame()
      openBrowser()
      while (true) {
        state = await placePiece(state, nextOffset(getBoard(state), state.current_piece), gameId)
      }
  }

  function openBrowser () {
    if (process.env.BROWSER) {
      opn(`${GUI_URL}`)
    }
  }

  function findBestOffset(board, currentPiece) {
    
  }

  function updateBoard(board, currentPiece, offset) {
    const locs = transformOffset(rotations[offset.rot][currentPiece], offset)
    const newBoard = cloneDeep(board)
    locs.forEach(l => newBoard[l.row][l.col] = 'X')
    return newBoard
  }

  function scoreBoard(newBoard) {
      let score = 0
      for (let y = 1; y < newBoard.length; y++) {
          for (let x = 0; x < newBoard[y].length; x++) {
              if (newBoard[y][x]) {
                for (let yPrime = y - 1; yPrime >= 0; yPrime--) {
                    if (!newBoard[yPrime][x]) {
                        score--
                    }
                }
            }
          }
      }
      return score
  }

  function nextOffset(board, currentPiece, initialRow = 0, initialCol = 0) {
      const possibleMoves = []
      for (let row = initialRow; row < board.length; row++) {
          for (let col = initialCol; col < board[row].length; col++) {
              for (let rot = 0; rot < rotations.length; rot++) {
                if (validateMove(rotations[rot][currentPiece], board, { row, col })) {
                    const newBoard = updateBoard(board, currentPiece, {
                        row,
                        col,
                        rot
                    })
                    possibleMoves.push({
                        row,
                        col,
                        rot,
                        score: scoreBoard(newBoard)
                    })
                }
            }
          }
      }
      if (possibleMoves.length > 0) {
          //console.log('MOVES', possibleMoves)
          return maxBy(possibleMoves, 'score')
      } else {
        return {
            row: 0,
            col: 20,
            rot: 0
        }
      }
  }

  function validateMove(pieceMask, board, offset) {
    const height = board.length
    const width = board[0].length
    let touching = offset.row === 0
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
          if (posY > 0 && board[posY-1][posX]) {
              touching = true
          }
        }
      }
    }
    return touching
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

  async function placePiece({current_piece, nextTurnToken, playerId}, offset, gameId) {
    const resp = await axios.post(`${BASE_URL}${gameId}/moves`, {
      locations: transformOffset(rotations[offset.rot][current_piece], offset)
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

  run().then(() => console.log('finished')).catch(err => console.log(err))
})();