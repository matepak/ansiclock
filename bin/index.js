#!/usr/bin/env node
"use strict";

const readline = require('readline');
const clear = require("clear");
const fonts = require("./fonts.json");
const dt = require("./datetime.js");
const { stdout, stderr } = require("process");
const argv = require("minimist")(process.argv.slice(2));
const TimeZones = require("./timeZones.json");
const clockWidth = 30;
const clockHeight = 7;

const ansiBgColor = {
  red: "\x1b[41m",
  green: "\x1b[42m",
  yellow: "\x1b[43m",
  blue: "\x1b[44m",
  magenta: "\x1b[45m",
  cyan: "\x1b[46m",
  white: "\x1b[47m",
  default: "\x1b[49m",
};
let dateTime = undefined;
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
      stdout.write(ansiBgColor[argv.c ?? "green"] + " ");
      stdout.write(ansiBgColor.default);
    }
  }
}

function clock() {
  renderClock(dateTime.getTime());
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
    stdout.write(dateTime.getDate());
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
  dateTime = dt.createDateTime(argv.t);
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  if (!stdout.isTTY) {
    console.log("ansii clock works only on TTY terminals");
    process.exit();
  }
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
