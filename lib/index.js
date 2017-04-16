'use strict';

var winston = require('winston');
var _ = require('lodash');
var fs = require('fs');


var Parser = require('./lib/parser').Parser;
var Transpiler = require('./lib/transpiler').Transpiler;

let script = fs.readFileSync('./pseudocod.txt');
let tree = Parser.parse(script.toString());
Parser.printTree(tree);
// console.log(Transpiler.transpileToCpp(tree));

// fs.writeFileSync('./main.cpp', Transpiler.transpileToCpp(tree));

// const spawn = require('child_process').spawn;

// const astyle = spawn('astyle', ['main.cpp', '--style=allman']);

// astyle.on('close', () => {
//   const gpp = spawn('g++', ['main.cpp']);
//   gpp.on('close', () => {
    
//     var prg = spawn('./a.out');
    
//     prg.stdout.on('data', (data) => {
//       console.log(data.toString());
//     });
    
//     prg.on('close', () => {
      
//     });
//   });
// });
