let audio = new Audio();
let valid;
window.onload = () => {
  audio.src = 'death.mp3';
  document.getElementById('diffValue').value = document.getElementById('difficulty').value;
  document.getElementById('difficulty').addEventListener('change', function() {
    document.getElementById('diffValue').value = this.value;
  });
  //Grid generation
  for (let i = 0; i < 9; i++) {
    let gridl = document.createElement('div');
    gridl.setAttribute('class', 'gridl');
    for (let j = 0; j < 9; j++) {
      let id = 'c_' + parseInt(j / 3 + parseInt(i / 3) * 3).toString() + '_' + parseInt((j % 3) + (i % 3) * 3).toString();
      let cell = document.createElement('input');
      cell.setAttribute('id', id);
      cell.setAttribute('type', 'number');
      cell.setAttribute('class', 'cell');
      cell.setAttribute('onclick', 'setCurrent(this)');
      cell.setAttribute('onchange', 'checkEndGame(this)');
      gridl.appendChild(cell);
    }
    document.getElementById('grid').appendChild(gridl);
  }
  document.getElementsByTagName('body')[0].addEventListener('click', event => {
    if (isInside(event, document.getElementById('grid')) == false) {
      let cur = document.getElementsByClassName('current')[0];
      if (cur) cur.classList.remove('current');
    }
  });
  fill();
};

function setCurrent(cell) {
  let cur = document.getElementsByClassName('current')[0];
  if (cur) cur.classList.remove('current');
  if (cell) cell.classList.add('current');
}

function fill(f) {
  if (f === true) resetGrid();
  const grid = generateGrid();
  const diff = document.getElementById('difficulty').value;
  let picked = [];
  for (let i = 0; i < diff; i++) {
    let row;
    let col;
    do {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    } while (picked.includes(row.toString() + col));
    picked.push(row.toString() + col);
    const id = 'c_' + row + '_' + col;
    const cell = document.getElementById(id);
    cell.value = grid[row][col];
    cell.classList.add('disabled');
  }
  valid = new validation(grid);
}

function checkEndGame(cell) {
  console.log('Check');
  if (valid.isValid(cell) === true) {
    cell.removeAttribute('onchange', 'checkEndGame(this)');
    cell.classList.add('disabled');
    cell.classList.remove('current');
  } else {
    document.getElementById('grid').classList.remove('visible');
    document.getElementById('grid').classList.add('invisible');
    document.getElementById('death').classList.remove('invisible');
    document.getElementById('death').classList.add('visible');
    document.getElementById('death').classList.add('fadeIn');
    audio.play();
    document.addEventListener('keypress', restore);
    function restore() {
      audio.pause();
      audio.currentTime = 0;
      document.getElementById('grid').classList.remove('invisible');
      document.getElementById('grid').classList.add('visible');
      document.getElementById('grid').classList.add('fadeIn');
      document.getElementById('death').classList.remove('visible');
      document.getElementById('death').classList.add('invisible');
      document.getElementById('grid').classList.add('fadeIn');
      resetGrid();
      fill();
      setCurrent();
      document.removeEventListener('keypress', restore);
    }
  }
}

function validation(grid) {
  this.grid = grid;
}

validation.prototype.isValid = function(cell) {
  if (cell.value > 0 && cell.value < 10) {
    const id = cell.id;
    let pos = id.replace('c_', '').split('_');
    if (cell.value != this.grid[pos[0]][pos[1]]) return false;
    else return true;
  } else {
    cell.removeAttribute('onchange', 'checkEndGame(this)');
    cell.value = '';
    cell.setAttribute('onchange', 'checkEndGame(this)');
  }
};

function resetGrid() {
  let grid = document.getElementById('grid').childNodes;
  for (let i = 0; i < grid.length; i++) {
    let gridl = grid[i].childNodes;
    for (let j = 0; j < gridl.length; j++) {
      if (gridl[j].hasAttribute('onchange')) gridl[j].removeAttribute('onchange', 'checkEndGame(this)');
      gridl[j].value = '';
      gridl[j].classList.remove('disabled');
      gridl[j].setAttribute('onchange', 'checkEndGame(this)');
    }
  }
}

function isInside(e) {
  var x = e.offsetX == undefined ? e.layerX : e.offsetX;
  var y = e.offsetY == undefined ? e.layerY : e.offsetY;
  if (x > 550 || y > 550) return false;
  else return true;
}

function generateGrid() {
  let grid = new Array(9);
  for (let i = 0; i < 9; i++) {
    grid[i] = new Array(9);
    for (let j = 0; j < 9; j++) grid[i][j] = 0;
  }
  let offset = 0;
  let start = 1;
  for (let n = 0; n < 3; n++) {
    for (let m = 0; m < 3; m++) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          grid[n * 3 + i][m * 3 + j] = ((i * 3 + j + offset) % 9) + 1;
        }
      }
      offset += 3;
    }
    offset = start;
    start++;
  }

  for (let i = 0; i < 10; i++) {
    let funcNum = Math.floor(Math.random() * 5);
    switch (funcNum) {
      case 0:
        swapColsA();
        break;
      case 1:
        swapColsS();
        break;
      case 2:
        swapRowsA();
        break;
      case 3:
        swapRowsS();
        break;
      case 4:
        transpose();
        break;
    }
  }
  return grid;

  function swapRowsS() {
    let row1 = Math.floor(Math.random() * 3);
    let row2 = row1;
    while (row2 == row1) row1 = Math.floor(Math.random() * 3);
    let blockRow = Math.floor(Math.random() * 3);
    for (let i = 0; i < 9; i++) {
      let value = grid[row1 + blockRow * 3][i];
      grid[row1 + blockRow * 3][i] = grid[row2 + blockRow * 3][i];
      grid[row2 + blockRow * 3][i] = value;
    }
  }
  function swapColsS() {
    let col1 = Math.floor(Math.random() * 3);
    let col2 = col1;
    while (col2 == col1) col2 = Math.floor(Math.random() * 3);
    let blockCol = Math.floor(Math.random() * 3);
    for (let i = 0; i < 9; i++) {
      let value = grid[i][col1 + blockCol * 3];
      grid[i][col1 + blockCol * 3] = grid[i][col2 + blockCol * 3];
      grid[i][col2 + blockCol * 3] = value;
    }
  }
  function swapRowsA() {
    let row1 = Math.floor(Math.random() * 3);
    let row2 = row1;
    while (row1 == row2) row2 = Math.floor(Math.random() * 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 9; j++) {
        let value = grid[i + row1 * 3][j];
        grid[i + row1 * 3][j] = grid[i + row2 * 3][j];
        grid[i + row2 * 3][j] = value;
      }
    }
  }
  function swapColsA() {
    let col1 = Math.floor(Math.random() * 3);
    let col2 = col1;
    while (col1 == col2) col2 = Math.floor(Math.random() * 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 9; j++) {
        let value = grid[j][i + col1 * 3];
        grid[j][i + col1 * 3] = grid[j][i + col2 * 3];
        grid[j][i + col2 * 3] = value;
      }
    }
  }
  function transpose() {
    for (let i = 0; i < 9; i++) {
      for (let j = i; j < 9; j++) {
        if (i == j) continue;
        let value = grid[i][j];
        grid[i][j] = grid[j][i];
        grid[j][i] = value;
      }
    }
  }
}
