#!/usr/bin/env node

const clear = require('clear');
const fonts = require('./fonts.json');
let argv = require('minimist')(process.argv.slice(2));

const drawLine = (line) => {
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '0') process.stdout.write(' ');
        if (line[i] === '1') {
            process.stdout.write('\x1b[2;37;41m ');
            process.stdout.write('\x1b[0m');
        }

    }
}

process.on('SIGINT', () => {
    clear();
    process.stderr.write('\x1B[?25h');
    process.exit();
});


clear();
process.stderr.write('\x1B[?25l');

function clock(timeZone) {
    renderClock(getTime());
}
process.stdout.clearScreenDown();
function getTime() {
    return [...Date().slice(16, 21)].map(char => char + ' ').join('');
}

function renderClock(time) {
    for (let j = 0; j < 5; j++) {
        for (let k = 0; k < time.length; k++) {
            drawLine(fonts.chars[time[k]][j]);
        }
        process.stdout.write('\n');
    }
    process.stdout.cursorTo(0, 0);
};




let clockIntervalId = setInterval(clock, 1000);
