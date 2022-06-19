class CheckerBoard {
  constructor(size = 8) {
    // Allow only 8x8, 10x10, 12x12 as board sizes
    if (size !== 8 && size !== 10 && size !== 12) {
      size = 8;
    }
    // Initialize board
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
    // Initialize game variables
    this.board = board;
    this.size = size;
    this.whiteCount = size;
    this.blackCount = size;
  }

  getSize() {
    return this.size;
  }

  getBoard() {
    return this.board;
  }

  getWhiteCount() {
    return this.whiteCount;
  }

  getBlackCount() {
    return this.blackCount;
  }

  getUpMoves(rowI, colI) {
    if (this.board[rowI][colI] !== 0 && this.board[rowI][colI] !== 3) {
      // Clear up any marked cells (unoptimized)
      for (const row of this.board) {
        for (const col of row) {
          if (col === 5) {
            col = 0;
          }
        }
      }
      const availableCells = [];

      if (rowI > 0) {
        // up left
        if (colI > 0 & this.board[rowI - 1][colI - 1] === 0) {
          availableCells.push({ row: rowI - 1, col: colI - 1 });
        }
        // up right
        if (colI < this.size - 1 && this.board[rowI - 1][colI + 1] === 0) {
          availableCells.push({ row: rowI - 1, col: colI + 1 });
        }
      }

      return availableCells;
    }
    return null;
  }

  getDownMoves(rowI, colI) {
    if (this.board[rowI][colI] !== 0 && this.board[rowI][colI] !== 1) {
      // Clear up any marked cells (unoptimized)
      for (const row of this.board) {
        for (const col of row) {
          if (col === 5) {
            col = 0;
          }
        }
      }
      const availableCells = [];

      if (rowI < this.size - 1) {
        // down left
        if (colI > 0 & this.board[rowI + 1][colI - 1] === 0) {
          availableCells.push({ row: rowI + 1, col: colI - 1 });
        }
        // down right
        if (colI < this.size - 1 && this.board[rowI + 1][colI + 1] === 0) {
          availableCells.push({ row: rowI + 1, col: colI + 1 });
        }
      }

      return availableCells;
    }
    return null;
  }
}

export default CheckerBoard;