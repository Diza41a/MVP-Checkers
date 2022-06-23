/* eslint-disable no-restricted-syntax */
const [
  emptyField, whitePiece, whiteQueen, blackPiece, blackQueen, markedField,
] = [0, 1, 2, 3, 4, 5];

// Generate conditional board (two-dimensional array)
const generateBoard = (sizeParameter) => {
  let size = sizeParameter;
  if (size !== 10 && size !== 12) {
    size = 8;
  }
  const board = new Array(size);
  for (let rowI = 0; rowI < size; rowI += 1) {
    board[rowI] = new Array(size);
    for (let colI = 0; colI < size; colI += 1) {
      if (rowI === size / 2 || rowI === size / 2 - 1
       || (rowI % 2 === 0 && colI % 2 === 0) || (rowI % 2 !== 0 && colI % 2 !== 0)) {
        board[rowI][colI] = 0;
      } else if (rowI < size / 2) {
        board[rowI][colI] = 3;
      } else {
        board[rowI][colI] = 1;
      }
    }
  }
  return board;
};

// const clearMarkedCells = (board) => {
//   // Clear up any marked cells (unoptimized)
//   for (const row of board) {
//     for (let col of row) {
//       if (col === markedField) {
//         col = emptyField;
//       }
//     }
//   }
// };

const getUpMoves = (board, rowI, colI) => {
  if (board[rowI][colI] !== 0 && board[rowI][colI] !== 3) {
    // Clear up any marked cells (unoptimized)
    for (const row of board) {
      for (let col of row) {
        if (col === markedField) {
          col = emptyField;
        }
      }
    }
    const availableCells = [];

    if (rowI > 0) {
      // up left
      if (colI > 0 && board[rowI - 1][colI - 1] === 0) {
        availableCells.push({ row: rowI - 1, col: colI - 1 });
      }
      // up right
      if (colI < board.length - 1 && board[rowI - 1][colI + 1] === 0) {
        availableCells.push({ row: rowI - 1, col: colI + 1 });
      }
    }

    return availableCells;
  }
  return null;
};

const getUpHitMoves = (board, rowI, colI) => {
  const currentPiece = board[rowI][colI];
  if (currentPiece !== emptyField && currentPiece !== blackPiece) {
    // Clear up any marked cells (unoptimized)
    for (const row of board) {
      for (let col of row) {
        if (col === markedField) {
          col = emptyField;
        }
      }
    }
    const availableCells = [];

    if (rowI > 1) {
      // Up left
      if (colI > 1) {
        if (board[rowI - 2][colI - 2] === emptyField) {
          const leftPiece = board[rowI - 1][colI - 1];

          const canEatBlack = (currentPiece === whitePiece || currentPiece === whiteQueen)
            && (leftPiece === blackPiece || leftPiece === blackQueen);
          const canEatWhite = (currentPiece === blackPiece || currentPiece === blackQueen)
            && (leftPiece === whitePiece || leftPiece === whiteQueen);
          if (canEatBlack || canEatWhite) {
            availableCells.push({ row: rowI - 2, col: colI - 2 });
          }
        }
      }
      // Up right
      if (colI < board.length - 2) {
        if (board[rowI - 2][colI + 2] === emptyField) {
          const rightPiece = board[rowI - 1][colI + 1];

          const canEatBlack = (currentPiece === whitePiece || currentPiece === whiteQueen)
            && (rightPiece === blackPiece || rightPiece === blackQueen);
          const canEatWhite = (currentPiece === blackPiece || currentPiece === blackQueen)
            && (rightPiece === whitePiece || rightPiece === whiteQueen);
          if (canEatBlack || canEatWhite) {
            availableCells.push({ row: rowI - 2, col: colI + 2 });
          }
        }
      }
    }

    return availableCells;
  }
  return null;
};

const getDownMoves = (board, rowI, colI) => {
  if (board[rowI][colI] !== 0 && board[rowI][colI] !== 1) {
    // Clear up any marked cells (unoptimized)
    for (const row of board) {
      for (let col of row) {
        if (col === markedField) {
          col = emptyField;
        }
      }
    }
    const availableCells = [];
    if (rowI < board.length - 1) {
      // down left
      if (colI > 0 && board[rowI + 1][colI - 1] === 0) {
        availableCells.push({ row: rowI + 1, col: colI - 1 });
      }
      // down right
      if (colI < board.length - 1 && board[rowI + 1][colI + 1] === 0) {
        availableCells.push({ row: rowI + 1, col: colI + 1 });
      }
    }

    return availableCells;
  }
  return null;
};

const getDownHitMoves = (board, rowI, colI) => {
  const currentPiece = board[rowI][colI];
  if (currentPiece !== emptyField && currentPiece !== whitePiece) {
    // Clear up any marked cells (unoptimized)
    for (const row of board) {
      for (let col of row) {
        if (col === markedField) {
          col = emptyField;
        }
      }
    }
    const availableCells = [];

    if (rowI < board.length - 2) {
      // Down left
      if (colI > 1) {
        if (board[rowI + 2][colI - 2] === emptyField) {
          const leftPiece = board[rowI + 1][colI - 1];

          const canEatBlack = (currentPiece === whitePiece || currentPiece === whiteQueen)
            && (leftPiece === blackPiece || leftPiece === blackQueen);
          const canEatWhite = (currentPiece === blackPiece || currentPiece === blackQueen)
            && (leftPiece === whitePiece || leftPiece === whiteQueen);
          if (canEatBlack || canEatWhite) {
            availableCells.push({ row: rowI + 2, col: colI - 2 });
          }
        }
      }
      // Down right
      if (colI < board.length - 2) {
        if (board[rowI + 2][colI + 2] === emptyField) {
          const rightPiece = board[rowI + 1][colI + 1];

          const canEatBlack = (currentPiece === whitePiece || currentPiece === whiteQueen)
            && (rightPiece === blackPiece || rightPiece === blackQueen);
          const canEatWhite = (currentPiece === blackPiece || currentPiece === blackQueen)
            && (rightPiece === whitePiece || rightPiece === whiteQueen);
          if (canEatBlack || canEatWhite) {
            availableCells.push({ row: rowI + 2, col: colI + 2 });
          }
        }
      }
    }

    return availableCells;
  }
  return null;
};

const destroyField = (board, rowI, colI) => {
  const updatedBoard = board.slice();
  updatedBoard[rowI][colI] = emptyField;
  return updatedBoard;
};

const movePiece = (board, currentCell, moveCell) => {
  // Do nothing if the same field was selected
  if (currentCell.row === moveCell.row && currentCell.col === moveCell.col) {
    return {
      moved: false, justAte: false, board, queened: false,
    };
  }

  const updatedBoard = board.slice();
  const moveMeta = { moved: true, justAte: false, queened: false };
  const piece = updatedBoard[currentCell.row][currentCell.col];
  updatedBoard[currentCell.row][currentCell.col] = emptyField;
  if (piece === whitePiece && moveCell.row === 0) {
    updatedBoard[moveCell.row][moveCell.col] = whiteQueen;
    moveMeta.queened = true;
  } else if (piece === blackPiece && moveCell.row === board.length - 1) {
    updatedBoard[moveCell.row][moveCell.col] = blackQueen;
    moveMeta.queened = true;
  } else {
    updatedBoard[moveCell.row][moveCell.col] = piece;
  }
  moveMeta.board = updatedBoard;

  // If a piece should be eaten
  if (Math.abs(currentCell.row - moveCell.row) === 2
    && Math.abs(currentCell.col - moveCell.col) === 2) {
    const destroyRow = (currentCell.row + moveCell.row) / 2;
    const destroyCol = (currentCell.col + moveCell.col) / 2;
    moveMeta.board = destroyField(updatedBoard, destroyRow, destroyCol);
    moveMeta.justAte = true;
  }

  return moveMeta;
};

module.exports = {
  checkerMethods: {
    generateBoard,
    getUpMoves,
    getUpHitMoves,
    getDownMoves,
    getDownHitMoves,
    movePiece,
    destroyField,
  },
};
