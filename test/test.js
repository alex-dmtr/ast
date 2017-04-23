var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
fs = Promise.promisifyAll(fs);
const spawn = require('child_process').spawn;
var stream = require('stream');

var tempPath = path.resolve(__dirname, "temp");

function createTempFolder() {
  if (!fs.existsSync(tempPath))
    fs.mkdirSync(tempPath);
}

function testCpp(code, input, output) {
  return new Promise(function(resolve, reject) { 
    
    var timestamp = +Date.now();
    
    var cppPath = path.resolve(tempPath, timestamp + '.cpp');
    var inputPath = path.resolve(tempPath, timestamp + '.txt');
    var binPath = path.resolve(tempPath, timestamp + '.exe');
    
    var tasks = [fs.writeFileAsync(cppPath, code), 
                 fs.writeFileAsync(inputPath, input)];
    
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
          console.log(output);
          
          resolve();
        });
      });
    });
}
)}

function doTest() {
   var code = `#include <iostream>
using namespace std;
int main()
{
    int a,b,n,i;
    cin>>a>>b;
    if (a>b)
    {
        cout<<a<<endl;
    }
    else
    {
        cout<<b<<endl;
    }
    return 0;
}`;

  return testCpp(code, "2 3", "3");
}

context('transpiler', () => {
  
  before('should create temp folder', () => {
    return createTempFolder();
    });
    
  it('should test basic cpp', doTest);
  // testCpp().then(console.log).catch(console.log);
});
