#!/usr/bin/env node

const process = require("process");
const clear = require("clear");
const fonts = require("./fonts.json");
const argv = require("minimist")(process.argv.slice(2));
const clockWidth = 34;
const clockHeight = 6;
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const bgColor = {
  red: "\x1b[41m",
  green: "\x1b[42m",
  yellow: "\x1b[43m",
  blue: "\x1b[44m",
  magenta: "\x1b[45m",
  cyan: "\x1b[46m",
  white: "\x1b[47m",
  default: "\x1b[49m",
};

let drawPosition = { cols: 0, lines: 0 };
function getTerminalSize() {
  return process.stdout.getWindowSize();
}

function drawLine(line) {
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "0") process.stdout.write(" ");
    if (line[i] === "1") {
      process.stdout.write(bgColor[argv.c ?? "green"] + " ");
      process.stdout.write(bgColor.default);
    }
  }
}
process.on("SIGINT", () => {
  clear();
  process.stderr.write("\x1B[?25h");
  process.exit();
});

process.stdout.on("resize", () => {
  clear();
  process.stdout.cursorTo(drawPosition.cols, drawPosition.lines);
});

function clock(timeZone) {
  renderClock(getTime());
}
function getTime() {
  let dateObj = new Date();
  return (
    dateObj.getHours().toString().padStart(2, 0) +
    ":" +
    dateObj.getMinutes().toString().padStart(2, 0)
  )
    .split("")
    .map((char) => char + " ")
    .join("");
}

function getDate() {
  let dateObj = new Date();

  return {
    day: dateObj.getDate().toString(),
    month: months[dateObj.getMonth()],
    year: dateObj.getFullYear().toString(),
  };
}

function renderClock(time) {
  for (let j = 0; j < 5; j++) {
    let currentCol = drawPosition.cols; 
    for (let k = 0; k < time.length; k++) {
      currentCol += fonts.chars[time[k]][j].length;
      if(currentCol > process.stdout.columns) {
        continue;
      }
      drawLine(fonts.chars[time[k]][j]);
    }
    process.stdout.write("\n");
    process.stdout.moveCursor(drawPosition.cols, 0);
  }
  process.stdout.write("\n");
  process.stdout.write("\x1B[10C");
  process.stdout.moveCursor(drawPosition.cols, 0);
  process.stdout.write(`${getDate().day} ${getDate().month} ${getDate().year}`);
  process.stdout.write("\n");
  process.stdout.cursorTo(drawPosition.cols, drawPosition.lines);
}

init();

process.stdout.cursorTo(drawPosition.cols, drawPosition.lines);
clock();

let clockIntervalId = setInterval(clock, 1000);

function setInMiddle() {
  let newPosition = getTerminalSize().map((pos) => Math.floor(pos / 2));
  drawPosition.cols = newPosition[0] - clockWidth / 2;
  drawPosition.lines = newPosition[1] - clockHeight / 2;
}

function init() {
  if (!process.stdout.isTTY) {
    console.log("ansii clock works only on TYY terminals");
    process.exit();
  }

  if (argv.m) {
    setInMiddle();
  }
  clear();
  process.stderr.write("\x1B[?25l");
}
