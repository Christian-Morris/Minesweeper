alert("Good luck!... Initiating MINESWEEPER!"); // Of course you can remove this (annoying) line ;)

// 1 - randomly generate and populate attributes to each of the sqaures (mine or not).
const rows = document.querySelectorAll("tr");
const columnsRowOne = rows[0].children;

const setMines = () => {
  let mine = "false";
  rows.forEach((row) => {
    const columns = row.children;
    Array.from(columns).forEach((column) => {
      const rnd = Math.floor(Math.random() * 10);
      if (rnd === 1) {
        mine = "true";
        // column.classList.add("mine");
      } else { mine = "false"; }
      column.setAttribute("mine", `${mine}`);
    });
  });
};

setMines();

// 2 - logic and assign neighbour numbers to all sqaures // all of the if (row/columnNumber </> 0/9) are to stop errors looking for undefined rows/columns that don't exist outside of the grid
const assignNeighbours = () => {
  let rowNumber = 0; // counter to tell which row we are on when iterating
  rows.forEach((row) => {
    const columns = row.children;
    let columnNumber = 0; // counter to tell which column we are on when iterating
    Array.from(columns).forEach((column) => {
      if (column.getAttribute("mine") === "true") { //this loop correctly finds each bomb
        if (columnNumber > 0) { column.previousElementSibling.setAttribute("neighbourNumber", `${Number(column.previousElementSibling.getAttribute("neighbourNumber")) + 1}`); }
        if (columnNumber < 9) { column.nextElementSibling.setAttribute("neighbourNumber", `${Number(column.nextElementSibling.getAttribute("neighbourNumber")) + 1}`); } // this and the row above correctly assign the left and right neighbouring numbers.
        if (rowNumber > 0) { //updates the neighbour number of the 3 cells above the bomb
          rows[rowNumber - 1].children[columnNumber].setAttribute("neighbourNumber", `${Number(rows[rowNumber - 1].children[columnNumber].getAttribute("neighbourNumber")) + 1}`);
          if (columnNumber > 0) { rows[rowNumber - 1].children[columnNumber].previousElementSibling.setAttribute("neighbourNumber", `${Number(rows[rowNumber - 1].children[columnNumber].previousElementSibling.getAttribute("neighbourNumber")) + 1}`); }
          if (columnNumber < 9) { rows[rowNumber - 1].children[columnNumber].nextElementSibling.setAttribute("neighbourNumber", `${Number(rows[rowNumber - 1].children[columnNumber].nextElementSibling.getAttribute("neighbourNumber")) + 1}`); }
        }
        if (rowNumber < 9) { //updates the neighbour number of the 3 cells below the bomb
          rows[rowNumber + 1].children[columnNumber].setAttribute("neighbourNumber", `${Number(rows[rowNumber + 1].children[columnNumber].getAttribute("neighbourNumber")) + 1}`);
          if (columnNumber > 0) { rows[rowNumber + 1].children[columnNumber].previousElementSibling.setAttribute("neighbourNumber", `${Number(rows[rowNumber + 1].children[columnNumber].previousElementSibling.getAttribute("neighbourNumber")) + 1}`); }
          if (columnNumber < 9) { rows[rowNumber + 1].children[columnNumber].nextElementSibling.setAttribute("neighbourNumber", `${Number(rows[rowNumber + 1].children[columnNumber].nextElementSibling.getAttribute("neighbourNumber")) + 1}`); }
        }
      }
      columnNumber += 1;
    });
    Array.from(columns).forEach((column) => { // this removes all the neighbourNumbers from each bomb after all are assigned
      if (column.getAttribute("mine") === "true") { column.classList.remove("neighbourNumber"); }
    });
    rowNumber += 1;
  });
};

assignNeighbours();

// 3 - left click = show sqaure
const allSquares = document.querySelectorAll("td");
allSquares.forEach((square) => {
  square.addEventListener("click", (event) => {
    if (square.getAttribute("mine") === "false") {
      square.classList.remove("unopened");
      if (square.getAttribute("neighbourNumber") > 0) {
        square.classList.add(`mine-neighbour-${square.getAttribute("neighbourNumber")}`);
      } else { square.classList.add("opened"); }
    }
  });

  // 4 - right click = show flag & lock sqaure
  square.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    square.classList.toggle("flagged");
  });

  // 5 - end the game if you hit a bomb
  square.addEventListener("click", (event) => {
    if (square.getAttribute("mine") === "true") {
      allSquares.forEach((cell) => {
        if (cell.getAttribute("mine") === "true") {
          cell.classList.remove("unopened");
          cell.classList.add("mine");
        }
      });
      setTimeout(() => { alert("BOOOOOOOM! Game Over! 😥 Reload to reset & try again..."); }, 100);
    }
  });
});

// 6 - check for number of bombs total vs number found, declare victory if you find them all
const bombCounter = document.querySelector("#bomb-counter");
let counter = 0;
rows.forEach((row) => {
  const columns = row.children;
  Array.from(columns).forEach((column) => {
    if (column.getAttribute("mine") === "true") { counter += 1; }
  });
});
bombCounter.innerHTML = `Total bomb count: ${counter} <em>Click here to see if you have won!</em>`;
let bombCheckCounter = 0;
bombCounter.addEventListener("click", () => {
  rows.forEach((row) => {
    const columns = row.children;
    Array.from(columns).forEach((column) => {
      if (column.getAttribute("mine") === "true" && column.classList.contains("flagged")) { bombCheckCounter += 1; }
    });
  });
  if (bombCheckCounter === counter) {
    setTimeout(() => { alert("WINNER! You have successfully found every mine!"); }, 100);
  } else { alert(`You have found ${bombCheckCounter} of the bombs. Keep going!`); bombCheckCounter = 0; }
});
