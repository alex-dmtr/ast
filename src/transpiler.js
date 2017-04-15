var _ = require('lodash');

class Transpiler {
  static transpileToCpp(tree) {
    
    function transpileExpression(node) {
      if (node.type == 'expression') {
        if (node.operator == 'assign')
          return transpileExpression(node.children[0]) + '=' + transpileExpression(node.children[1]);
        else if (node.operator == 'addition')
          return transpileExpression(node.children[0]) + '+' + transpileExpression(node.children[1]);
      }
      else
        return node.value;
    }
    let code = '';
    
    let node = tree.root;
    
    while (node) {
      let line = '';
      
      if (node.type == 'declare') {
        line = node.varType + ' ' + node.registers.join(',') + ';';
      }
      else if (node.type == 'expression') {
        line = transpileExpression(node) + ';';
      }
      else if (node.type == 'function') {
        if (node.functionName == 'print') {
          line = _.concat('cout', node.parameters, 'endl').join('<<') + ';';
        }
      }
      
      code = code + line + '\n';
      
      node = node.next;
    }
    
    return `#include <iostream>
    
    using namespace std;
    
    int main()
    {
        ${code}
        
        return 0;
    }`;
  }
}

module.exports = {
  Transpiler
};