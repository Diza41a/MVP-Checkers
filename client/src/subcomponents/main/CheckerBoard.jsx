import React, { useState, useEffect } from 'react';

// import CheckerBoard from './CheckerBoard.js';
const { checkerMethods } = require('./checkerMethods.js');

const [emptyField, whitePiece, whiteQueen, blackPiece, blackQueen, markedField] = [0, 1, 2, 3, 4, 5];
const pieces = [null, 'white-piece', 'white-queen', 'black-piece', 'black-queen'];

export default function CheckerBoard() {
  const [isLoading, toggleLoading] = useState(true);
  const [board, setBoard] = useState();
  const [turn, toggleTurn] = useState('white');
  const [piecesToEat, setPiecesToEat] = useState(null); // { piece: { row, col }, eadables: [{row, col}, ...] }
  let currentPiece = null;

  // Sound effects
  const moveSound = new Audio('../assets/sounds/move.mp3');
  const newQueenSound = new Audio('../assets/sounds/queened.wav');
  const destroyPieceSound = new Audio('../assets/sounds/eaten.wav');

  // componentDidMount
  // Give state a board matrix from the server
  useEffect(() => {
    toggleLoading(false);
    setBoard(checkerMethods.generateBoard(8));
  }, []);

  // componentDidUpdate()
  // Clear potential moves
  useEffect(() => {
    document.querySelectorAll('.potential-move').forEach((el) => {
      el.classList.remove('potential-move');
    });
  })

  // Visual presentation of a checker piece
  const generatePiece = (value, rowI, colI) => {
    // If value is not a checker piece, don't generate anything
    if (value <= 0 || value >= 5) {
      return null;
    } else {
      return <div className={pieces[value]} data-row={rowI} data-col={colI}></div>;
    }
  }

  // Get all of the potential moves for selected piece
  const getMoves = (e) => {
    // Clear all higlighted fields
    document.querySelectorAll('.potential-move').forEach((field) => {
      field.classList.remove('potential-move');
    });

    // Collect piece information
    const el = e.target;
    let rowI = parseInt(el.getAttribute('data-row'), 10);
    let colI = parseInt(el.getAttribute('data-col'), 10);
    const piece = board[rowI][colI];

    // If there's a current obligation to eat a piece,
    // and the wrong piece is selected, do not proceed
    if (piecesToEat !== null
      && (piecesToEat.piece.row !== rowI || piecesToEat.piece.col !== colI)) {
        return;
    }

    const moves = [];
    // Do not proceed when it's opponent's move
    if (turn === 'white' && (piece === blackPiece || piece === blackQueen)
    || turn === 'black' && (piece === whitePiece || piece === whiteQueen)) {
      return;
    }

    // Get upward moveset for white pieces, or black queens
    if (piece === whitePiece || piece === whiteQueen || piece === blackQueen) {
      if (piecesToEat === null) {
        moves.push(checkerMethods.getUpMoves(board, rowI, colI));
      }
      moves.push(checkerMethods.getUpHitMoves(board, rowI, colI));
    }
    // Get downward moveset for black pieces, or white queens
    if (piece === blackPiece || piece === blackQueen || piece === whiteQueen) {
      if (piecesToEat === null) {
        moves.push(checkerMethods.getDownMoves(board, rowI, colI));
      }
      moves.push(checkerMethods.getDownHitMoves(board, rowI, colI));
    }
    // Highlight possible moves
    moves.flat().forEach((move) => {
      document.querySelector(`td[data-row="${move.row}"][data-col="${move.col}"]`).classList.add('potential-move');
    });
    // Highlight current piece
    if (board[rowI][colI] !== emptyField) {
      document.querySelector(`td[data-row="${rowI}"][data-col="${colI}"]`).classList.add('potential-move');
      currentPiece = { row: rowI, col: colI };
    } else {
      currentPiece = null;
    }
  }

  // Move a piece / Destroy an enemy
  const move = (e) => {
    // Only allow movement on the marked fields
    if (!e.target.classList.contains('potential-move')) {
      return;
    }

    // Collect piece information
    const el = e.target;
    let rowI = parseInt(el.getAttribute('data-row'), 10);
    let colI = parseInt(el.getAttribute('data-col'), 10);
    const moveMeta = (checkerMethods.movePiece(board, currentPiece, { row: rowI, col: colI }));
    // If move occurred, update the board
    // Perform all necessary checks and effects
    if (moveMeta.moved) {
      setBoard(moveMeta.board);
      // Play corresponding sound effect
      if (moveMeta.queened) {
        newQueenSound.play();
      } else if (moveMeta.justAte) {
        destroyPieceSound.play();
      } else {
        moveSound.play();
      }

      // If just ate/destroyed a piece, check for more 'food'
      if (moveMeta.justAte && !moveMeta.queened) {
        // Collect potential hit moves in all direction of the piece
        const hitMovesUp = checkerMethods.getUpHitMoves(moveMeta.board, rowI, colI);
        const hitMovesDown = checkerMethods.getDownHitMoves(moveMeta.board, rowI, colI);
        let hitMoves = [];
        if (hitMovesUp !== null) {
          hitMoves.push(hitMovesUp);
        }
        if (hitMovesDown !== null) {
          hitMoves.push(hitMovesDown);
        }
        hitMoves = hitMoves.flat();
        // If obligation for a hit move exists,
        // don't toggle turn, or allow any other moves...
        if (hitMoves.length > 0) {
          setPiecesToEat({ piece: { row: rowI, col: colI }, eadables: hitMoves });
          return;
        } else {
          // Otherwise, reset the obligations
          setPiecesToEat(null);
        }
      }
      turn === 'white' ? toggleTurn('black') : toggleTurn('white');
    }
  }

  // Move handling logics unified under a single manager
  const moveManager = (e) => {
    if (currentPiece !== null) {
      move(e);
      currentPiece = null;
    }
    if (currentPiece === null) {
      getMoves(e);
    }
  };

  // Generate visual representation of the board
  if (isLoading) {
    return (
      <div>Loading...</div>
    );
  }
  const visualBoard = (
    <table className="checker-board">
      <tbody>
        {board.map((row, rowI) => {
          return <tr key={rowI}>{board[rowI].map((col, colI) => {
            let classes = rowI % 2 === 0 ? 'checker-field even' : 'checker-field odd';
            return <td className={classes} key={colI}  data-row={rowI} data-col={colI} onClick={moveManager} >
              {generatePiece(col, rowI, colI)}
            </td>;
          })}</tr>
        })}
      </tbody>
    </table>
  );

  return (
    <div>{visualBoard}</div>
  );
};
