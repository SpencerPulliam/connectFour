  /** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
 // creates an array of empty arrays based on the value of height
  for (let i = 0; i < HEIGHT; i++) {
   
    let row = [];
    for (let j = 0; j < WIDTH; j++) {
      // adds null elements based on the value of width
        row.push(null);    
      }
      board.push(row);
  }
  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {

  let htmlBoard = document.getElementById('board');

  // creates table rows, assigns id and adds an event listener to check for a click
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // loops over each row, creates a table data element, and appends it to the row
  for (let x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }

  htmlBoard.append(top);

  // loops over columns and creates table row elements based on the height constant
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");

    // loops over the rows and creates table data elements based on the width constant, sets id based on coordinates 
    // generated from the position in the row and column at current point in the loop.
    // then appends that cell to the row
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }

    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // traverses a column in reverse, returns a y coordinate if it finds a null value
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {

// creates a piece
let piece = document.createElement('div');
piece.classList.add('piece');

// piece will be red if it is player 1's turn
if (currPlayer === 1) {
  piece.classList.add('p1');
}

// piece will be blue if it is player 2's turn
else {
  piece.classList.add('p2');
}

// gets the correct cell to place the piece in, and places it
let cell = document.getElementById(`${y}-${x}`);
cell.append(piece);

}

/** endGame: announce game end */

// simple alert box triggered on win condition
function endGame(msg) {
  return alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table

  // changes null to player number when piece is placed
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // if every cell in every row is not null, it is a tie
  if (board.every(row => row.every(cell => cell))) {
    return endGame('It\'s a tie!');
  }

  // switch players
  if (currPlayer == 1) {
    currPlayer = 2;
  }
  else {
    currPlayer = 1;
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {

    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // traverse the outer array
  for (let y = 0; y < HEIGHT; y++) {
    // traverse the inner array
    for (let x = 0; x < WIDTH; x++) {

      // checks for horizontal win; true if four cells in a row are of the same player
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];

      // checks for vertical win; true if four cells in a row are of the same player
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];

      // checks for diagonal right win; true if four cells in a row are of the same player
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];

      // checks for diagonal left win; true if four cells in a row are of the same player
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // if any of the win conditions are true, return true
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
