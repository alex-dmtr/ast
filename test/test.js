var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
fs = Promise.promisifyAll(fs);
const spawn = require('child_process').spawn;
var stream = require('stream');
var rimraf = Promise.promisify(require('rimraf'));
var assert = require('assert');
var Parser = require('../lib/parser').Parser;
var Transpiler = require('../lib/transpiler').Transpiler;
var tempPath = path.resolve(__dirname, "temp");
var winston = require('winston');
// winston.remove(winston.transports.Console);

function createTempFolder() {
  
  function makeDir() {
    return fs.mkdirAsync(tempPath);
  }
  
  if (fs.existsSync(tempPath))
    return rimraf(tempPath).then(makeDir);
  else
    return makeDir();
}

function testCpp(code, input, expectedOutput) {
  return new Promise(function(resolve, reject) { 
    
    var timestamp = +Date.now();
    
    var cppPath = path.resolve(tempPath, timestamp + '.cpp');
    var binPath = path.resolve(tempPath, timestamp + '.exe');
    
    var tasks = [fs.writeFileAsync(cppPath, code)];
    
    Promise.all(tasks).then(function() {
      
      var compile = spawn('g++', [cppPath, '-o', binPath]);
      
      compile.on('close', function() {
        
        var prg = spawn(binPath);
        var stdinStream = new stream.Readable();
        
        stdinStream.push(input);  // Add data to the internal queue for users of the stream to consume
        stdinStream.push(null);   // Signals the end of the stream (EOF)
        stdinStream.pipe(prg.stdin);
        
        var output = "";
        prg.stdout.on('data', function(data) {
            output += data;
        });
        
        prg.on('close', () => {
          
          assert.equal(output.trim(), expectedOutput.trim(), "wrong output");
          
          resolve();
        });
      });
    });
}
)}

function testPseudocode(code, input, expectedOutput) {
  return Promise.resolve(Parser.parse(code))
    .then(function(tree) {
      return Transpiler.transpileToCpp(tree);
    })
    .then(function(cpp) {
      return testCpp(cpp, input, expectedOutput);
    });
}
function doTest() {
   var code = `inceput
   intreg a, b, suma
   
   citire a
   citire b
   
   suma <- a + b
   
   afisare suma
   sfarsit`;
  return testPseudocode(code, "2 3", "5");
}

context('transpiler', () => {
  
  before('should create temp folder', () => {
    return createTempFolder();
    });
    
  it('should test basic pseudocode', doTest);
  // testCpp().then(console.log).catch(console.log);
});
