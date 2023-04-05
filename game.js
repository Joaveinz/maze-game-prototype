const { modalWin } = require("./modules/modal-win.js");

// variable initialisation

var modal = document.getElementById("myModal");
var closeButton = document.getElementsByClassName("close")[0];
var decisionBased = false;
var playing = true;

document
  .getElementById("play_again")
  .addEventListener("click", () => document.location.reload());

closeButton.onclick = function () {
  modal.style.display = "none";
};

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

window.addEventListener("keydown", doKeyDown, true);

function doKeyDown(evt) {
  var handled = false;
  if (playing) {
    switch (evt.keyCode) {
      case 38 /* Up arrow was pressed */:
        m.moveup("canvas");
        handled = true;
        break;
      case 87 /* Up arrow was pressed */:
        m.moveup("canvas");
        handled = true;
        break;
      case 40 /* Down arrow was pressed */:
        m.movedown("canvas");
        handled = true;
        break;
      case 83 /* Down arrow was pressed */:
        m.movedown("canvas");
        handled = true;
        break;
      case 37 /* Left arrow was pressed */:
        m.moveleft("canvas");
        handled = true;
        break;
      case 65 /* Left arrow was pressed */:
        m.moveleft("canvas");
        handled = true;
        break;
      case 39 /* Right arrow was pressed */:
        m.moveright("canvas");
        handled = true;
        break;
      case 68 /* Right arrow was pressed */:
        m.moveright("canvas");
        handled = true;
        break;
    }
    if (m.checker("canvas")) playing = false;
  }
  if (handled) evt.preventDefault(); // prevent arrow keys from scrolling the page (supported in IE9+ and all other browsers)
}

var dsd = function (size) {
  this.N = size;
  this.P = new Array(this.N);
  this.R = new Array(this.N);

  this.init = function () {
    for (var i = 0; i < this.N; i++) {
      this.P[i] = i;
      this.R[i] = 0;
    }
  };

  this.union = function (x, y) {
    var u = this.find(x);
    var v = this.find(y);
    if (this.R[u] > this.R[v]) {
      this.R[u] = this.R[v] + 1;
      this.P[u] = v;
    } else {
      this.R[v] = this.R[u] + 1;
      this.P[v] = u;
    }
  };

  this.find = function (x) {
    if (x == this.P[x]) return x;
    this.P[x] = this.find(this.P[x]);
    return this.P[x];
  };
};

function random(min, max) {
  return min + Math.random() * (max - min);
}
function randomChoice(choices) {
  return choices[Math.round(random(0, choices.length - 1))];
}

m = new maze(10, 10);
m.init();
m.add_edges();
m.gen_maze();
m.draw_canvas("canvas");

addEventListener("input", (event) => {
  decisionBased = event.target.value === "decision";
  m.decisionBased = decisionBased;
});
