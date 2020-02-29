function GameOfLife(boardWidth, boardHeight) {
  this.width = boardWidth;
  this.height = boardHeight;
  // this.board = ...
  // this.cells = [...];
  // this.createBoard = function() {...
  // this.selectCells = function() {...
  //    Utworzenie początkowego glidera:
  // this.setCellState = function(x, y, state) {...
  // this.firstGlider = function() {...
  //    Mechanizm gry:
  // this.computeCellNextState = function(x, y) {...
  // this.computeNextGeneration = function() {...
  // this.printNextGeneration = function() {...
}
// Dodanie planszy
GameOfLife.prototype.board = document.getElementById('board');
// Dodanie pustej tablicy (w której później znajdą się wszystkie pola)
GameOfLife.prototype.cells = [];
// Wypełnienie planszy
GameOfLife.prototype.createBoard = function() {
  // Utworzenie pojedynczego pola (diva) w celu pobrania jego wymiarów (z CSS)
  const newDiv = document.createElement('div');
  this.board.appendChild(newDiv);
  const div = this.board.querySelector('div');
  const divStyle = getComputedStyle(div);
  const divWidth = parseInt(divStyle.width);
  const divHeight = parseInt(divStyle.height);
  // Przypisanie pobranych wymiarów do nowych pól w obiekcie
  const cellWidth = divWidth;
  const cellHeight = divHeight;
  // Usunięcie utworzonego pola (diva) po zakończeniu pobierania wymiarów
  div.parentElement.removeChild(div);
  // Nadanie wymiarów planszy na podstawie podanej ilości pól
  const boardWidthInPx = this.width * cellWidth;
  const boardHeightInPx = this.height * cellHeight;
  board.style.width = `${boardWidthInPx}px`;
  board.style.height = `${boardHeightInPx}px`;
  // Stworzenie odpowiedniej ilości pól i dodanie ich do planszy
  const boardSize = this.width * this.height;
  for (let i = 0; i < boardSize; i++) {
    const newDiv = document.createElement('div');
    this.board.appendChild(newDiv);
    // Umieszczenie powstałych pól w tablicy
    this.cells.push(newDiv);
  }
}
// Metoda zaznaczająca pola (1) poprzez wciśnięcie, przytrzymanie klawisza myszy i przesunięcie kursora lub (2) poprzez kilknięcie
// To rozbudowana modyfikacja metody z treści zadania, która zaznaczała pola tylko poprzez kliknięcie
GameOfLife.prototype.selectCells = function() {
  // Zaznaczenie / Odznaczenie pól poprzez wciśnięcie klawisza myszy, przytrzymanie i przesunięcie kursora
  let isMouseDown = null;
  this.board.addEventListener('mousedown', function(e) {
    isMouseDown = true;
    const cells = this.children;
    for (let i = 0; i < cells.length; i++) { // .forEach nie działa
      cells[i].addEventListener('mouseenter', function(e) {
        if (isMouseDown) {
          e.target.classList.toggle('live');
        }
      });
    }
  });
  this.board.addEventListener('mouseup', function(e) {
    isMouseDown = false;
  });
  // Zaznaczenie / Odznaczenie pola poprzez kliknięcie
  this.board.addEventListener('click', function(e) {
    e.target.classList.toggle('live');
  });
}
// Stworzenie początkowego glidera
GameOfLife.prototype.setCellState = function(x, y, state) {
  const thisCellIndex = x + y * this.width;
  const thisCell = this.cells[thisCellIndex];
  thisCell.classList.add(state);
}
GameOfLife.prototype.firstGlider = function() {
  this.setCellState(0, 0, 'live');
  this.setCellState(1, 1, 'live');
  this.setCellState(2, 1, 'live');
  this.setCellState(0, 2, 'live');
  this.setCellState(1, 2, 'live');
}
// Generowanie nowego stanu pola
GameOfLife.prototype.computeCellNextState = function(x, y) {
  // Lokalizacja sąsiednich pól
  const neighborsIndexesArr = [];
  const thisObject = this;
  provideProperIndex(x - 1, y - 1, thisObject);
  provideProperIndex(x, y - 1, thisObject);
  provideProperIndex(x + 1, y - 1, thisObject);
  provideProperIndex(x - 1, y, thisObject);
  provideProperIndex(x + 1, y, thisObject);
  provideProperIndex(x - 1, y + 1, thisObject);
  provideProperIndex(x, y + 1, thisObject);
  provideProperIndex(x + 1, y + 1, thisObject);
  // Funkcja przenosi koordynat na drugą stronę planszy, jeśli koordynat ten wskazuje miejsce poza planszą
  function provideProperIndex(eqX, eqY, thisObject) {
    let x = eqX;
    if ( x < 0 ) {
      const properX = thisObject.width - Math.abs(x);
      x = properX;
    }
    if ( x >= thisObject.width ) {
      x = 0;
    }
    let y = eqY;
    if ( y < 0 ) {
      const properY = thisObject.height - Math.abs(y);
      y = properY;
    }
    if ( y >= thisObject.height ) {
      y = 0;
    }
    const neighborCellIndex = x + y * thisObject.width;
    neighborsIndexesArr.push(neighborCellIndex);
  }
  // Sprawdzenie stanu sąsiednich pól
  let numberOfLiveCells = 0;
  for (let i = 0; i < neighborsIndexesArr.length; i++) {
    if ( this.cells[neighborsIndexesArr[i]].className.includes('live') ) {
      numberOfLiveCells++;
    }
  }
  // Ustalenie przyszłego stanu bieżącego pola
  const thisCellIndex = x + y * this.width;
  const thisCell = this.cells[thisCellIndex];
  if ( thisCell.className.includes('live') ) {
    if ( numberOfLiveCells < 2 || numberOfLiveCells > 3 ) {
      return 0;
    }
    return 1;
  }
  if ( numberOfLiveCells === 3 ) {
    return 1;
  }
  return 0;
}
// Generowanie nowego wyglądu planszy
GameOfLife.prototype.computeNextGeneration = function() {
  const nextGeneration = [];
  for (let i = 0; i < this.height; i++) {
    for (let j = 0; j < this.width; j++) {
      nextGeneration.push( this.computeCellNextState(j, i) );
    }
  }
  return nextGeneration;
}
// Wyświetlenie nowego wyglądu planszy
GameOfLife.prototype.printNextGeneration = function () {
  const nextGeneration = this.computeNextGeneration();
  this.cells.forEach(function(cell, i) {
    if ( nextGeneration[i] === 1 ) {
      cell.classList.add('live');
    }
    else {
      cell.classList.remove('live');
    }
  });
}
// -----------------------------------------------------------------------


// UKŁAD GRY
// -----------------------------------------------------------------------
// 1) Przed rozpoczęciem gry - gracz ustala wielkość planszy w podanym zakresie
let playerWidth = parseInt(prompt(`
  Welcome to 'Game Of Life'!
  To start the game you need to provide the size of the board.
  Please type the number (the optimal number is ranging from 10 to 100).
`));
if ( playerWidth < 10 ) {
  playerWidth = 10;
}
if ( playerWidth > 100 ) {
  playerWidth = 100;
}
let playerHeight = playerWidth;

// 2) Przygotowanie gry
const game = new GameOfLife(playerWidth, playerHeight);
game.createBoard();
game.selectCells();
game.firstGlider();

// 3) Uruchomienie / Wstrzymanie gry - obsługa przycisków
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
let interval = null;
playBtn.addEventListener('click', function(e) {
  interval = setInterval(function() {
    playBtn.disabled = true;
    game.printNextGeneration();
  }, 200);
});
pauseBtn.addEventListener('click', function(e) {
  clearInterval(interval);
  playBtn.disabled = false;
});
// -----------------------------------------------------------------------
// // Odtwarzanie poklatkowe
// playBtn.addEventListener('click', function(e) {
//   game.printNextGeneration();
// });


// Metoda z treści zadania, która okazała się być zbędna

// // Metoda (1) przeliczająca współrzędne kliknięcia (x, y) na indeks tablicy, (2) zwracająca odpowiednie pole na podstawie tego indeksu i (3) obsługująca nadawanie klasy .live temu polu
// GameOfLife.prototype.getTheClickedCell = function() {
//   const thisObject = this;
//   this.cells.forEach(function(cell) {
//     cell.addEventListener('mousedown', function(e) {
//       // Konwersja współrzędnych kliknięcia z px na odpowiednie pole (x, y)
//       const referenceForOffset = this.parentElement; // plansza
//       const localX = Math.floor( (event.clientX - referenceForOffset.offsetLeft) / thisObject.width );
//       const localY = Math.floor( (event.clientY - referenceForOffset.offsetTop) / thisObject.height );
//       // Lokalizacja klikniętego pola za pomocą indeksu tablicy
//       const currentCellIndex = localX + localY * thisObject.width;
//       // Przełączenie klasy .live w klikniętym polu
//       const thisCell = thisObject.cells[currentCellIndex];
//       thisCell.classList.toggle('live');
//       // Zwrócenie klikniętego pola (w tym momencie wydaje się zbędne, ale jest zgodne z treścią zadania)
//       return thisCell;
//     });
//   });
// }
// game.getTheClickedCell();