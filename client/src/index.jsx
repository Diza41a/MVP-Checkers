import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
// create the root of the app by selection where the app should be mounted in the dom
const root = createRoot(document.getElementById('root'));

// import CheckerBoard from './CheckerBoard.js';
const { checkerMethods } = require('./checkerMethods.js');

const pieces = [null, 'white-piece', 'white-queen', 'black-piece', 'black-queen'];

function App() {
  const [isLoading, toggleLoading] = useState(true);
  const [board, setBoard] = useState();
  const [turn, toggleTurn] = useState('white');
  let currentPiece = null;
  // componentDidMount
  useEffect(() => {
    setBoard(checkerMethods.generateBoard(8));
    toggleLoading(false);
  }, []);

  // componentDidUpdate()
  useEffect(() => {
    document.querySelectorAll('.potential-move').forEach((el) => {
      el.classList.remove('potential-move');
    });
  })

  // Visual presentation of a checker piece
  const generatePiece = (value, rowI, colI) => {
    // If value is not a checker piece
    if (value <= 0 || value >= 5) {
      return null;
    } else {
      return <div className={pieces[value]} data-row={rowI} data-col={colI}></div>;
    }
  }

  const getMoves = (e) => {
    // Clear all higlighted fields
    document.querySelectorAll('.potential-move').forEach((el) => {
      el.classList.remove('potential-move');
    });
    const el = e.target;
    let rowI = el.getAttribute('data-row');
    let colI = el.getAttribute('data-col');
    if (rowI !== null && colI !== null) {
      const moves = [];
      rowI = parseInt(rowI, 10);
      colI = parseInt(colI, 10);
      const col = board[rowI][colI];
      // Do not proceed if not player's move
      if (turn === 'white' && (col === 3 || col === 4)
      || turn === 'black' && (col === 1 || col === 2)) {
        return;
      }

      if (col === 1 || col === 2 || col === 4) {
        moves.push(checkerMethods.getUpMoves(board, rowI, colI));
      }
      if (col === 3 || col === 2 || col === 4) {
        moves.push(checkerMethods.getDownMoves(board, rowI, colI));
      }
      // Highlight possible moves
      moves.flat().forEach((move) => {
        document.querySelector(`td[data-row="${move.row}"][data-col="${move.col}"]`).classList.add('potential-move');
      });
      // Highlight current piece
      if (board[rowI][colI] !== 0) {
        document.querySelector(`td[data-row="${rowI}"][data-col="${colI}"]`).classList.add('potential-move');
        currentPiece = { row: rowI, col: colI };
      } else {
        currentPiece = null;
      }
    }
  }

  const move = (e) => {
    if (e.target.classList.contains('potential-move')) {
      const el = e.target;
      let rowI = el.getAttribute('data-row');
      let colI = el.getAttribute('data-col');
      if (rowI !== null && colI !== null) {
        rowI = parseInt(rowI, 10);
        colI = parseInt(colI, 10);
        const moveMeta = (checkerMethods.movePiece(board, currentPiece, { row: rowI, col: colI }));
        setBoard(moveMeta.board);
        // If move occurred, toggle turn
        if (moveMeta.moved) {
          if (turn === 'white') {
            toggleTurn('black');
          } else if (turn === 'black') {
            toggleTurn('white');
          }
        }
      }
    }
  }

  const moveManager = (e) => {
    if (currentPiece !== null) {
      move(e);
      currentPiece = null;
    }
    if (currentPiece === null) {
      getMoves(e);
    }
  };

  if (!isLoading) {
    // Generate visual representation of the board
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
  } else {
    return <div>Loading...</div>;
  }

}

root.render(<App />);
