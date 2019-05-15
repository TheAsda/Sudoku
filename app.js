let audio = new Audio();
window.onload = () => {
  audio.pause();
  audio.src = "death.mp3";
  for (let i = 0; i < 9; i++) {
    let gridl = document.createElement("div");
    gridl.setAttribute("class", "gridl");
    for (let j = 0; j < 9; j++) {
      let id =
        "c_" +
        parseInt(j / 3 + parseInt(i / 3) * 3).toString() +
        "_" +
        parseInt((j % 3) + (i % 3) * 3).toString();

      let cell = document.createElement("input");
      cell.setAttribute("id", id);
      cell.setAttribute("type", "number");
      cell.setAttribute("class", "cell");
      cell.setAttribute("min", "1");
      cell.setAttribute("max", "9");
      cell.setAttribute("onchange", "checkEndGame(this)");
      cell.setAttribute("onclick", "setCurrent(this)");
      gridl.appendChild(cell);
    }
    document.getElementById("grid").appendChild(gridl);
  }
  document.getElementsByTagName("body")[0].addEventListener("click", event => {
    if (isInside(event, document.getElementById("grid")) == false) {
      console.log("Out of grid");
      let cur = document.getElementsByClassName("current")[0];
      if (cur) cur.classList.remove("current");
    }
  });
  fill();
};

function setCurrent(cell) {
  let cur = document.getElementsByClassName("current")[0];
  if (cur) cur.classList.remove("current");
  if (cell) cell.classList.add("current");
}

function fill() {
  for (let i = 0; i < 15; i++) {
    let randomRow = Math.floor(Math.random() * 9);
    let randomCol = Math.floor(Math.random() * 9);
    let cell = document.getElementById("c_" + randomRow + "_" + randomCol);
    do {
      cell.value = Math.round(Math.random() * 9);
    } while (validate(cell) !== true);
    cell.classList.add("disabled");
    cell.classList.remove("current");
  }
}

function checkEndGame(cell) {
  if (validate(cell) === true) {
    console.log("Continue");
    cell.classList.add("disabled");
    cell.classList.remove("current");
  } else {
    document.getElementById("grid").classList.remove("visible");
    document.getElementById("grid").classList.add("invisible");
    document.getElementById("death").classList.remove("invisible");
    document.getElementById("death").classList.add("visible");
    document.getElementById("death").classList.add("fadeIn");
    audio.play();
    resetGrid();
    document.addEventListener("keypress", restore);
    function restore() {
      audio.pause();
      audio.currentTime = 0;
      document.getElementById("grid").classList.remove("invisible");
      document.getElementById("grid").classList.add("visible");
      document.getElementById("grid").classList.add("fadeIn");
      document.getElementById("death").classList.remove("visible");
      document.getElementById("death").classList.add("invisible");
      document.getElementById("grid").classList.add("fadeIn");
      fill();
      setCurrent();
    }
  }
}

function validate(cell) {
  if (cell.value > 0 && cell.value < 10) {
    const id = cell.id;
    const position = id.replace("c_", "").split("_");
    const row = [];
    const col = [];
    gridl = cell.parentElement;
    const cells = gridl.childNodes;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] == cell) continue;
      if (cells[i].value == cell.value) {
        return false;
      }
    }

    for (let i = 0; i < 9; i++) {
      let rowValue;
      if (i != position[1])
        rowValue = document.getElementById("c_" + position[0] + "_" + i).value;
      let colValue;
      if (i != position[0])
        colValue = document.getElementById("c_" + i + "_" + position[1]).value;
      if (rowValue != "" && rowValue != undefined) row.push(rowValue);
      if (colValue != "" && colValue != undefined) col.push(colValue);
    }
    if (row.indexOf(cell.value) != -1 || col.indexOf(cell.value) != -1) {
      return false;
    }
    return true;
  } else {
    cell.value = "";
  }
}

function resetGrid() {
  let grid = document.getElementById("grid").childNodes;
  for (let i = 0; i < grid.length; i++) {
    let gridl = grid[i].childNodes;
    for (let j = 0; j < gridl.length; j++) {
      gridl[j].value = "";
      gridl[j].classList.remove("disabled");
    }
  }
}

function isInside(e) {
  var x = e.offsetX == undefined ? e.layerX : e.offsetX;
  var y = e.offsetY == undefined ? e.layerY : e.offsetY;
  if (x > 550 || y > 550) return false;
  else return true;
}
