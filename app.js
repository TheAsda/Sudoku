window.onload = () => {
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
      cell.setAttribute("onchange", "validate(this)");
      gridl.appendChild(cell);
    }
    document.getElementById("grid").appendChild(gridl);
  }
};

function validate(cell) {
  if (cell.value > 0 && cell.value < 10) {
    console.log("Right number");
    const id = cell.id;
    const position = id.replace("c_", "").split("_");
    const row = [];
    const col = [];
    gridl = cell.parentElement;
    const cells = gridl.childNodes;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] == cell) continue;
      if (cells[i].value == cell.value) {
        alert("You lost");
        resetGrid();
        return;
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
      alert("You lost");
      resetGrid();
    }
  } else {
    console.log("Wrong number");
    cell.value = "";
  }
}

function resetGrid() {
  let grid = document.getElementById("grid").childNodes;
  for (let i = 0; i < grid.length; i++) {
    let gridl = grid[i].childNodes;
    for (let j = 0; j < gridl.length; j++) gridl[j].value = "";
  }
}
