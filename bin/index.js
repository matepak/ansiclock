#!/usr/bin/env node

const clear = require('clear');
const fonts = require('./fonts.json');
const argv = require('minimist')(process.argv.slice(2));
const months = [
    'Jan', 
    'Feb', 
    'Mar', 
    'Apr', 
    'May', 
    'Jun', 
    'Jul',
    'Aug', 
    'Sep', 
    'Oct', 
    'Nov', 
    'Dec'
];

const bgColor = {
    'red': '\x1b[41m',
    'green': '\x1b[42m',
    'yellow': '\x1b[43m',
    'blue': '\x1b[44m',
    'magenta': '\x1b[45m',
    'cyan': '\x1b[46m',
    'white': '\x1b[47m',
    'default': '\x1b[49m',
};


const drawLine = (line) => {
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '0') process.stdout.write(' ');
        if (line[i] === '1') {
            process.stdout.write(bgColor[argv.c??'green'] + ' ');
            process.stdout.write(bgColor.default);
        }

    }
}

process.on('SIGINT', () => {
    clear();
    process.stderr.write('\x1B[?25h');
    process.exit();
});

process.stdout.on('resize', () => clear());


clear();
process.stderr.write('\x1B[?25l');

function clock(timeZone) {
    renderClock(getTime());
}
function getTime() {
    return [...Date().slice(16, 21)].map(char => char + ' ').join('');
}

function getDate() {
    let dateObj = new Date();

    return {
        day: dateObj.getDate().toString(),
        month: months[dateObj.getMonth()],
        year: dateObj.getFullYear().toString()
    }

}


function renderClock(time) {
    for (let j = 0; j < 5; j++) {
        for (let k = 0; k < time.length; k++) {
            drawLine(fonts.chars[time[k]][j]);
        }
        process.stdout.write('\n');
    }
    process.stdout.write('\n');
    process.stdout.write('\x1B[10C');
    process.stdout.write(`${getDate().day} ${getDate().month} ${getDate().year}`);
    process.stdout.write('\n');
    process.stdout.cursorTo(0, 0);
};

clock();
let clockIntervalId = setInterval(clock, 1000);
