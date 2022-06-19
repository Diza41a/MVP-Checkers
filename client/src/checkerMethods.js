// Generate conditional board (two-dimensional array)
const generateBoard = (size) => {
  if (size !== 10 && size !== 12) {
    size = 8;
  }
  let board = new Array(size);
    for (let rowI = 0; rowI < size; rowI += 1) {
      board[rowI] = new Array(size);
      for (let colI = 0; colI < size; colI += 1) {
        if (rowI === size / 2 || rowI === size / 2 - 1 ||
        (rowI % 2 === 0 && colI % 2 === 0) || (rowI % 2 !== 0 && colI % 2 !== 0)) {
          board[rowI][colI] = 0;
        } else if (rowI < size / 2) {
          board[rowI][colI] = 3;
        } else {
          board[rowI][colI] = 1;
        }
      }
    }
  return board;
}

const getUpMoves = (board, rowI, colI) => {
  if (board[rowI][colI] !== 0 && board[rowI][colI] !== 3) {
    // Clear up any marked cells (unoptimized)
    for (const row of board) {
      for (const col of row) {
        if (col === 5) {
          col = 0;
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

const getDownMoves = (board, rowI, colI) => {
  if (board[rowI][colI] !== 0 && board[rowI][colI] !== 1) {
    // Clear up any marked cells (unoptimized)
    for (const row of board) {
      for (const col of row) {
        if (col === 5) {
          col = 0;
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

const movePiece = (board, currentCell, moveCell) => {
  if (currentCell.row !== moveCell.row && currentCell.col !== moveCell.col) {
    const updatedBoard = board.slice();
    const piece = updatedBoard[currentCell.row][currentCell.col];
    updatedBoard[currentCell.row][currentCell.col] = 0;
    updatedBoard[moveCell.row][moveCell.col] = piece;

    return { moved: true, board: updatedBoard };
  } else {
    return { moved: false, board: board };
  }
}

module.exports = {
  checkerMethods: {
    generateBoard,
    getUpMoves,
    getDownMoves,
    movePiece,
  }
}
