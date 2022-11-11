let randomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

const MINSPEED = 1;
const MAXSPEED = 3;
const MINSQUARES = 5;
const MAXSQUARES = 10;

const numOfSquares = randomNumber(MINSQUARES, MAXSQUARES);

let squares = [];

var sound = new Audio("hit.mp3");
sound.preload = 'auto';
sound.load();

function playSound(volume) {
    var click = sound.cloneNode();
    click.volume = volume;
    click.play();
}

function startGame() {
  for (i = 0; i < numOfSquares; i++) {
    squares[i] = new component();
  }
  myGameArea.start();
}

var myGameArea = {
  canvas: document.getElementById("game"),
  start: function () {
    this.context = this.canvas.getContext("2d");
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
    this.canvas.addEventListener("click", function (event) {
      var { x, y } = getCursorPosition(myGameArea.canvas, event);
      squares.forEach(function (element, index) {
        if (
          element.x - element.width / 2 <= x &&
          x <= element.x + element.width / 2 &&
          element.y - element.height / 2 <= y &&
          y <= element.y + element.height / 2
        ) {
          squares.splice(index, 1);
          playSound(1);
        }
      });
    });
  },
  stop: function () {
    clearInterval(this.interval);
  },
  clear: function () {
    this.context.clearRect(
      0,
      0,
      myGameArea.canvas.width,
      myGameArea.canvas.height
    );
  },
  showStats: function () {
    this.context.textAlign = "end";
    this.context.textBaseline = "top";
    this.context.font = "20px Georgia";
    this.context.fillText(
      "ukupno: " +
        numOfSquares +
        " | pogođeno: " +
        parseInt(parseInt(numOfSquares) - parseInt(squares.length)),
      this.canvas.width,
      0
    );
  },
  showWinScreen: function () {
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.font = "50px Georgia";
    this.context.fillText(
      "Pobjedili ste!",
      myGameArea.canvas.width / 2,
      myGameArea.canvas.height / 2
    );
  },
};
function component() {
  let color = "blue";
  this.width = 30;
  this.height = 30;
  this.speed_x = randomNumber(MINSPEED, MAXSPEED);
  this.speed_y = randomNumber(MINSPEED, MAXSPEED);
  this.x = randomNumber(0, myGameArea.canvas.width);
  this.y = randomNumber(0, myGameArea.canvas.width);

  this.update = function () {
    ctx = myGameArea.context;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = color;
    ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
    ctx.restore();
  };

  this.newPos = function () {
    if (this.x - this.width / 2 <= 0)
      this.speed_x = changeSpeed(this.speed_x, "positive");
    else if (this.x + this.width / 2 >= myGameArea.canvas.width)
      this.speed_x = changeSpeed(this.speed_x, "negative");
    if (this.y - this.height / 2 < 0)
      this.speed_y = changeSpeed(this.speed_y, "negative");
    else if (this.y + this.height / 2 >= myGameArea.canvas.height)
      this.speed_y = changeSpeed(this.speed_y, "positive");
    this.x += this.speed_x;
    this.y -= this.speed_y;
  };
}

function updateGameArea() {
  myGameArea.clear();
  if (squares.length == 0) {
    myGameArea.showWinScreen();
  }
  squares.forEach(function (element) {
    element.newPos();
    element.update();
  });
  myGameArea.showStats();
}

function getCursorPosition(canvas, ev) {
  var rect = canvas.getBoundingClientRect();
  var x = ev.clientX - rect.left;
  var y = ev.clientY - rect.top;
  return { x, y };
}

function changeSpeed(speed, direction) {
  let sign;
  if (speed >= MAXSPEED) sign = -1;
  else if (speed <= MINSPEED) sign = 1;
  else sign = Math.round(Math.random()) ? 1 : -1;
  speed += Math.random() * 1.5 * sign;
  if (direction == "positive") return Math.abs(speed);
  else return -Math.abs(speed);
}
