export class maze
{
  width;
  height;
  Board;
  vis;
  EL = [];
  S = 25;
  x = 1;
  decisionBased = false;

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.Board = new Array(2 * this.N + 1)
      .map(i => new Array(2 * this.M + 1)
        .map(j => {
        if (!(i % 2) && !(j % 2)) {
            return "+";
        } else if (!(i % 2)) {
            return "-";
        } else if (!(j % 2)) {
            return "|";
        } else {
            return " ";
        }
        }
        )
    );
    this.vis = new Array(2 * this.N + 1).map(i => new Array(2 * this.M + 1)).fill(0);
    this.delay = 2;
    this.x = 1;
    this.decisionBased = false;
    for (var i = 0; i < 2 * this.N + 1; i++) {
      for (var j = 0; j < 2 * this.M + 1; j++) {
        if (!(i % 2) && !(j % 2)) {
          this.Board[i][j] = "+";
        } else if (!(i % 2)) {
          this.Board[i][j] = "-";
        } else if (!(j % 2)) {
          this.Board[i][j] = "|";
        } else {
          this.Board[i][j] = " ";
        }
        this.vis[i][j] = 0;
      }
    }
  }

  add_edges() {
    for (var i = 0; i < this.N; i++) {
      for (var j = 0; j < this.M; j++) {
        if (i != this.N - 1) {
          this.EL.push([[i, j], [i + 1, j], 1]);
        }
        if (j != this.M - 1) {
          this.EL.push([[i, j], [i, j + 1], 1]);
        }
      }
    }
  };

  //Hash function
  hash(e) {
    return e[1] * this.M + e[0];
  };

  randomize(EL) {
    for (var i = 0; i < EL.length; i++) {
      var si = Math.floor(Math.random() * 387) % EL.length;
      var tmp = EL[si];
      EL[si] = EL[i];
      EL[i] = tmp;
    }
    return EL;
  };

  breakwall(e) {
    var x = e[0][0] + e[1][0] + 1;
    var y = e[0][1] + e[1][1] + 1;
    this.Board[x][y] = " ";
  };

  gen_maze() {
    this.EL = this.randomize(this.EL);
    var D = new dsd(this.M * this.M);
    D.init();
    var s = this.h([0, 0]);
    var e = this.h([this.N - 1, this.M - 1]);
    this.Board[1][0] = " ";
    this.Board[2 * this.N - 1][2 * this.M] = " ";
    //Run Kruskal
    for (var i = 0; i < this.EL.length; i++) {
      var x = this.h(this.EL[i][0]);
      var y = this.h(this.EL[i][1]);
      if (D.find(s) == D.find(e)) {
        if (!(D.find(x) == D.find(s) && D.find(y) == D.find(s))) {
          if (D.find(x) != D.find(y)) {
            D.union(x, y);
            this.breakwall(this.EL[i]);
            this.EL[i][2] = 0;
          }
        }
      } else if (D.find(x) != D.find(y)) {
        D.union(x, y);
        this.breakwall(this.EL[i]);
        this.EL[i][2] = 0;
      } else {
        continue;
      }
    }
  };

  draw_canvas(id) {
    this.canvas = document.getElementById(id);
    var scale = this.S;
    temp = [];
    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext("2d");
      this.Board[1][0] = "$";
      for (var i = 0; i < 2 * this.N + 1; i++) {
        for (var j = 0; j < 2 * this.M + 1; j++) {
          if (this.Board[i][j] != " ") {
            // TODO: understand why this is commented out
            //} && this.Board[i][j] != '&') {
            this.ctx.fillStyle = "#0b052d";
            this.ctx.fillRect(scale * i, scale * j, scale, scale);
          } else if (i < 5 && j < 5) temp.push([i, j]);
        }
      }
      x = randomChoice(temp);
      this.Board[x[0]][x[1]] = "&";
      this.ctx.fillStyle = "#c4192a";
      this.ctx.fillRect(scale * x[0], scale * x[1], scale, scale);
    }
  };

  playerPos() {
    for (var i = 0; i < 2 * this.N + 1; i++) {
      for (var j = 0; j < 2 * this.M + 1; j++) {
        if (this.Board[i][j] == "&") {
          return [i, j];
        }
      }
    }
  };

  moveclear(a, b) {
    var scale = this.S;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "#99AFA3";
    this.ctx.fillRect(scale * a, scale * b, scale, scale);
    this.Board[a][b] = " ";
  };

  move(a, b) {
    var scale = this.S;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "#c4192a";
    this.ctx.fillRect(scale * a, scale * b, scale, scale);
    this.Board[a][b] = "&";
  };

  moveup() {
    if (this.moveUpPossible()) {
      this.moveclear(i, j + 1);
      this.move(i, j);
      if (
        this.decisionBased &&
        !this.moveLeftPossible() &&
        !this.moveRightPossible()
      ) {
        this.moveup();
      }
    }
  };

  movedown() {
    if (this.moveDownPossible()) {
      this.moveclear(i, j - 1);
      this.move(i, j);
      if (
        this.decisionBased &&
        !this.moveLeftPossible() &&
        !this.moveRightPossible()
      ) {
        this.movedown();
      }
    }
  };

  moveleft() {
    if (this.moveLeftPossible()) {
      this.moveclear(i + 1, j);
      this.move(i, j);
      if (
        this.decisionBased &&
        !this.moveUpPossible() &&
        !this.moveDownPossible()
      ) {
        this.moveleft();
      }
    }
  };

  moveright() {
    if (this.moveRightPossible()) {
      this.moveclear(i - 1, j);
      this.move(i, j);
      if (
        this.decisionBased &&
        !this.moveUpPossible() &&
        !this.moveDownPossible()
      ) {
        this.moveright();
      }
    }
  };

  moveUpPossible() {
    cord = this.playerPos();
    i = cord[0];
    j = cord[1];
    j -= 1;
    return this.Board[i][j] == " ";
  };

  moveDownPossible() {
    cord = this.playerPos();
    i = cord[0];
    j = cord[1];
    j += 1;
    return this.Board[i][j] == " ";
  };

  moveLeftPossible() {
    cord = this.playerPos();
    i = cord[0];
    j = cord[1];
    i -= 1;
    return this.Board[i][j] == " ";
  };

  moveRightPossible() {
    cord = this.playerPos();
    i = cord[0];
    j = cord[1];
    i += 1;
    return this.Board[i][j] == " ";
  };

  checkWin() {
    cord = this.playerPos();
    i = cord[0];
    j = cord[1];
    if ((i == 19 && j == 20) || (i == 1 && j == 0)) {
      modalWin();
      return 1;
    }
    return 0;
  };
};
