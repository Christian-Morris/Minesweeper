// to do list:
// - explode reveals flagged squares if incorrectly marked...

const flash = document.querySelector("alert");
flash.innerHTML = "<div class='alert alert-warning alert-dismissible fade show' role='alert'>Choose your grid size & difficulty. Then prepare for <strong>MINESWEEPER!</strong><button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>"
const audioBomb = new Audio('bomb.mp3');
const audioTransformer = new Audio('transformer.mp3');
const audioWinner = new Audio('winner.mp3');
audioWinner.volume = 0.5;


// 1 - generate grid and randomly populate attributes to each of the sqaures (mine or not).
const gameSetup = document.querySelector("#game-setup");
const gridSize = document.querySelector("#grid-size");
const grid = document.querySelector("#minesweeper");
const bombCounter = document.querySelector("#bomb-counter");

// 1.1 - set difficulty -> easy = 1:10, medium = 1:8, hard = 1:6
let mineMultiplier = 10;
const setMines = () => {
  const difficulty = document.querySelector("#difficulty").value;
  switch (difficulty) {
    case "medium":
      mineMultiplier = 8;
      break;
    case "hard":
      mineMultiplier = 6;
      break;
    default:
  }
  const rows = document.querySelectorAll("tr");
  let mine = "false";
  rows.forEach((row) => {
    const columns = row.children;
    Array.from(columns).forEach((column) => {
      const rnd = Math.floor(Math.random() * mineMultiplier);
      if (rnd === 1) {
        mine = "true";
      } else { mine = "false"; }
      column.setAttribute("mine", `${mine}`);
    });
  });
};

// 2 - logic and assign neighbour numbers to all sqaures // all of the if (row/columnNumber </> 0/gridLimit) are to stop errors looking for undefined rows/columns that don't exist outside of the grid
const assignNeighbours = (gridLimit) => {
  const rows = document.querySelectorAll("tr");
  let rowNumber = 0; // counter to tell which row we are on when iterating
  rows.forEach((row) => {
    const columns = row.children;
    let columnNumber = 0; // counter to tell which column we are on when iterating
    Array.from(columns).forEach((column) => {
      if (column.getAttribute("mine") === "true") { // this loop correctly finds each bomb
        if (columnNumber > 0) { column.previousElementSibling.setAttribute("neighbourNumber", `${Number(column.previousElementSibling.getAttribute("neighbourNumber")) + 1}`); }
        if (columnNumber < gridLimit) { column.nextElementSibling.setAttribute("neighbourNumber", `${Number(column.nextElementSibling.getAttribute("neighbourNumber")) + 1}`); } // this and the row above correctly assign the left and right neighbouring numbers.
        if (rowNumber > 0) { // updates the neighbour number of the 3 cells above the bomb
          rows[rowNumber - 1].children[columnNumber].setAttribute("neighbourNumber", `${Number(rows[rowNumber - 1].children[columnNumber].getAttribute("neighbourNumber")) + 1}`);
          if (columnNumber > 0) { rows[rowNumber - 1].children[columnNumber].previousElementSibling.setAttribute("neighbourNumber", `${Number(rows[rowNumber - 1].children[columnNumber].previousElementSibling.getAttribute("neighbourNumber")) + 1}`); }
          if (columnNumber < gridLimit) { rows[rowNumber - 1].children[columnNumber].nextElementSibling.setAttribute("neighbourNumber", `${Number(rows[rowNumber - 1].children[columnNumber].nextElementSibling.getAttribute("neighbourNumber")) + 1}`); }
        }
        if (rowNumber < gridLimit) { // updates the neighbour number of the 3 cells below the bomb
          rows[rowNumber + 1].children[columnNumber].setAttribute("neighbourNumber", `${Number(rows[rowNumber + 1].children[columnNumber].getAttribute("neighbourNumber")) + 1}`);
          if (columnNumber > 0) { rows[rowNumber + 1].children[columnNumber].previousElementSibling.setAttribute("neighbourNumber", `${Number(rows[rowNumber + 1].children[columnNumber].previousElementSibling.getAttribute("neighbourNumber")) + 1}`); }
          if (columnNumber < gridLimit) { rows[rowNumber + 1].children[columnNumber].nextElementSibling.setAttribute("neighbourNumber", `${Number(rows[rowNumber + 1].children[columnNumber].nextElementSibling.getAttribute("neighbourNumber")) + 1}`); }
        }
      }
      columnNumber += 1;
    });
    Array.from(columns).forEach((column) => { // this removes all the neighbourNumbers from each bomb after all are assigned on the current row
      if (column.getAttribute("mine") === "true") { column.classList.remove("neighbourNumber"); }
    });
    rowNumber += 1;
  });
};

// 3.1 - Blow up the grid, revealing all touching (u/d/l/r) sqaures with 0 neighbour number.
const explode = (square, gridLimit) => {
  const rows = document.querySelectorAll("tr");
  if (square.hasAttribute("neighbourNumber") === false && square.getAttribute("mine") === "false") {
    square.classList.add("clicked-and-nn");
    let rowNumber = 0; // counter to tell which row we are on when iterating
    rows.forEach((row) => {
      const columns = row.children;
      let columnNumber = 0; // counter to tell which column we are on when iterating
      Array.from(columns).forEach((column) => {
        if (column.classList.contains("clicked-and-nn") === true) { // this loop should find the square that was clicked
          if (columnNumber > 0) {
            column.previousElementSibling.classList.remove("unopened");
            if (column.previousElementSibling.getAttribute("neighbourNumber") > 0) {
              column.previousElementSibling.classList.add(`mine-neighbour-${column.previousElementSibling.getAttribute("neighbourNumber")}`); // assigns the right svg for the corresponding neighbour number
            } else {
              column.previousElementSibling.classList.add("opened");
              column.previousElementSibling.classList.add("clicked-and-nn");
            }
          }

          if (columnNumber < gridLimit) {
            column.nextElementSibling.classList.remove("unopened");
            if (column.nextElementSibling.getAttribute("neighbourNumber") > 0) {
              column.nextElementSibling.classList.add(`mine-neighbour-${column.nextElementSibling.getAttribute("neighbourNumber")}`); // assigns the right svg for the corresponding neighbour number
            } else {
              column.nextElementSibling.classList.add("opened");
              column.nextElementSibling.classList.add("clicked-and-nn");
            }
          } // this and the ifloop above correctly assign the left and right neighbouring numbers.

          if (rowNumber > 0) { //opens the 1 cell above the bomb
            rows[rowNumber - 1].children[columnNumber].classList.remove("unopened");
            if (rows[rowNumber - 1].children[columnNumber].getAttribute("neighbourNumber") > 0) {
              rows[rowNumber - 1].children[columnNumber].classList.add(`mine-neighbour-${rows[rowNumber - 1].children[columnNumber].getAttribute("neighbourNumber")}`); // assigns the right svg for the corresponding neighbour number
            } else {
              rows[rowNumber - 1].children[columnNumber].classList.add("opened");
              rows[rowNumber - 1].children[columnNumber].classList.add("clicked-and-nn");
            }
          }
          if (rowNumber < gridLimit) { //opens the 1 cell below the bomb
            rows[rowNumber + 1].children[columnNumber].classList.remove("unopened");
            if (rows[rowNumber + 1].children[columnNumber].getAttribute("neighbourNumber") > 0) {
              rows[rowNumber + 1].children[columnNumber].classList.add(`mine-neighbour-${rows[rowNumber + 1].children[columnNumber].getAttribute("neighbourNumber")}`); // assigns the right svg for the corresponding neighbour number
            } else {
              rows[rowNumber + 1].children[columnNumber].classList.add("opened");
              rows[rowNumber + 1].children[columnNumber].classList.add("clicked-and-nn");
            }
          }
        }
        columnNumber += 1;
      });
      rowNumber += 1;
    });
  }
};

// 6 - check for number of bombs total vs number found, declare victory if you find them all
const bombCount = (flagCount) => {
  const rows = document.querySelectorAll("tr");
  let counter = 0;
  rows.forEach((row) => {
    const columns = row.children;
    Array.from(columns).forEach((column) => {
      if (column.getAttribute("mine") === "true") { counter += 1; }
    });
  });
  let bombCheckCounter = 0;
  rows.forEach((row) => {
    const columns = row.children;
    Array.from(columns).forEach((column) => {
      if (column.getAttribute("mine") === "true" && column.classList.contains("flagged")) { bombCheckCounter += 1; }
    });
  });
  if (bombCheckCounter === counter) {
    setTimeout(() => { flash.innerHTML = "<div class='alert alert-success alert-dismissible fade show' role='alert'><strong>WINNER!</strong> You have successfully found every mine!<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>"; }, 100);
    audioWinner.play();
   }
  bombCounter.innerHTML = `Total bombs: ${counter} | Total flags placed: ${flagCount} | Bombs found: ${bombCheckCounter}`;
};


// 3->6 event listeners
const eventListeners = (gridLimit, flagCount) => {
  // 3 - left click = show sqaure
  const rows = document.querySelectorAll("tr");
  const allSquares = document.querySelectorAll("td");
  allSquares.forEach((square) => {
    square.addEventListener("click", (event) => {
      if (square.classList.contains("flagged") === true || square.classList.contains("question") === true) { return; } // guard clause to stop right click on flagged/questioned sqaures

      if (square.getAttribute("mine") === "false") {
        square.classList.remove("unopened");
        if (square.getAttribute("neighbourNumber") > 0) {
          square.classList.add(`mine-neighbour-${square.getAttribute("neighbourNumber")}`); // assigns the right svg for the corresponding neighbour number
        } else { square.classList.add("opened"); }
      }

      // 3.1 - Blow up the grid, revealing all touching (u/d/l/r) sqaures with 0 neighbour number.
      for (let i = 1; i <= gridLimit; i++) { // runs explode gridLimit times, the max possible number of times for current grid size
        explode(square, gridLimit);
      }
      // currently can't ever need to happen more than gridLimit times (there are gridLimit+1 rows)
      // need to figure out a better way to test if it should explode again. Search through and
      // and run until there are no neighbour number of 0 next to a clicked-and-nn classes.
    });

    // 4 - right click = flagged->questioned->empty & lock sqaure (guard clause of 3 - left click)

    square.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      if (square.classList.contains("flagged") === true) {
        square.classList.add("question");
        square.classList.remove("flagged");
      } else if (square.classList.contains("question") === true) {
        square.classList.remove("question");
      } else {
        square.classList.add("flagged");
        flagCount += 1;
        bombCount(flagCount);
      }
    });

    // 5 - end the game if you hit a bomb
    square.addEventListener("click", (event) => {
      if (square.getAttribute("mine") === "true") {
        audioBomb.play();
        allSquares.forEach((cell) => {
          if (cell.getAttribute("mine") === "true") {
            cell.classList.remove("unopened");
            cell.classList.add("mine");
          }
        });
        setTimeout(() => { flash.innerHTML = "<div class='alert alert-danger alert-dismissible fade show' role='alert'>BOOOOOOOM! <strong>Game Over!</strong> 😥 Create a new grid to try again...<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>"; }, 100);
      }
    });
  });
};

// 0 - set up the game/grid based on user inputs
gameSetup.addEventListener("submit", (event) => {
  event.preventDefault();
  flash.innerHTML = "";
  audioTransformer.play();
  const gridLimit = gridSize.value - 1; // -1 to account for indexes starting at 0.
  const column = "<td class='unopened'></td>";
  let buildingRow = "";
  for (let i = 1; i <= gridSize.value; i++) { // gridSize times concatonate 1 column.
    buildingRow += column;
  }
  const builtRow = `<tr>${buildingRow}</tr>`;
  let builtRows = "";
  for (let i = 1; i <= gridSize.value; i++) { // gridSize times concatonate 1 column.
    builtRows += builtRow;
  }
  grid.innerHTML = builtRows;
  document.querySelector("#bomb-counter-container").classList.remove("d-none");
  setMines();
  assignNeighbours(gridLimit);
  let flagCount = 0;
  eventListeners(gridLimit, flagCount);
  bombCount(0);
});

// tooltip JS
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
