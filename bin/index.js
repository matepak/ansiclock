#!/usr/bin/env node
"use strict";

const readline = require('readline');
const clear = require("clear");
const fonts = require("./fonts.json");
const { stdout, stderr } = require("process");
const argv = require("minimist")(process.argv.slice(2));
const clockWidth = 30;
const clockHeight = 7;

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

const date = {

  months: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ],

  day: new Date().getDate().toString(),
  month: new Date().getMonth(),
  year: new Date().getFullYear().toString(),
  
  get() {
    return `${this.day} ${this.months[this.month]} ${this.year}`;
  }
};

let printCords = { cols: 0, rows: 0 };



process.stdin.on('keypress', (chunk, key) => {
  if (key && key.name === 'q') {
  clear();
  process.exit();
  }
});

process.on("SIGINT", () => {
  clear();
  stderr.write("\x1B[?25h");
  process.exit();
});

stdout.on("resize", () => {
  clear();
  initDrawPos();
});

function printLine(line) {
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "0") stdout.write(" ");
    if (line[i] === "1") {
      stdout.write(bgColor[argv.c ?? "green"] + " ");
      stdout.write(bgColor.default);
    }
  }
}

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
    if (stdout.getWindowSize()[1] < printCords.rows + clockHeight) {
      break;
    }
    let currentCollumn = printCords.cols;
    for (let k = 0; k < time.length; k++) {
      currentCollumn += fonts.chars[time[k]][j].length;
      if (stdout.getWindowSize()[0] < currentCollumn) {
        continue;
      }

      printLine(fonts.chars[time[k]][j]);
    }

    stdout.write("\n");
    stdout.moveCursor(printCords.cols);
  }
  if (stdout.getWindowSize()[1] >= printCords.rows + clockHeight)
    stdout.write(date.get());
  debug();
  stdout.cursorTo(printCords.cols, printCords.rows);
}

let clockIntervalId = setInterval(clock, 1000);

function debug() {
  if (argv.d) {
    stdout.write("\n");
    console.log({ window_size: stdout.getWindowSize() });
    console.log({ start_position: printCords });
  }
}

function init() {
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  if (!stdout.isTTY) {
    console.log("ansii clock works only on TTY terminals");
    process.exit();
  }

  // if (process.platform !== "linux") {
  //   console.log("ansiclock currently works only in linux");
  //   process.exit();
  // }
  clear();
  stderr.write("\x1B[?25l");
  initDrawPos();
}

function initDrawPos() {
  if (argv.m) {
    let windowSize = stdout.getWindowSize();
    printCords.cols = Math.floor(windowSize[0] / 2 - clockWidth / 2);
    printCords.rows = Math.floor(windowSize[1] / 2 - clockHeight / 2);
  }
  stdout.cursorTo(printCords.cols, printCords.rows);
}

init();
clock();
