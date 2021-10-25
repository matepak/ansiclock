#!/usr/bin/env node

const clear = require('clear');
const fonts = require('../fonts/fonts.json');
let argv = require('minimist')(process.argv.slice(2));

function clock(timeZone) {
    clear();
    renderClock("00 : 00");
    console.log('press ctrl+c to exit...');
}

function renderClock(time) {
    for (let j = 0; j < 5; j++) {
        for (let k = 0; k < time.length; k++) {
            process.stdout.write(fonts.chars[time[k]][j]);
        }
        process.stdout.write('\n');
    }
    return clock;

};

let clockIntervalId = setInterval(clock, 1000);
