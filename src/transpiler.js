var _ = require('lodash');

class Transpiler {
  static transpileToCpp(tree) {
    
    function transpileExpression(node) {
      if (node.type == 'expression') {
        var left = transpileExpression(node.children[0]);
        var right = transpileExpression(node.children[1]);
        if (node.operator == 'assign') 
          return transpileExpression(node.children[0]) + '=' + transpileExpression(node.children[1]);
        else if (node.operator == 'addition')
          return transpileExpression(node.children[0]) + '+' + transpileExpression(node.children[1]);
        else if (node.operator == 'gt')
          return `${left}>${right}`;
        
      }
      else
        return node.value;
    }
    
    function getNodeCode(node, skipSemicolon = false) {
      let line = '';
      
      if (node.type == 'empty' || node.type == 'block-start' || node.type=='end')
        return line;
      if (node.type == 'declare') {
        line = node.varType + ' ' + node.registers.join(',');
      }
      else if (node.type == 'expression') {
        line = transpileExpression(node);
      }
      else if (node.type == 'function') {
        if (node.functionName == 'print') {
          line = _.concat('cout', node.parameters, 'endl').join('<<');
        }
      }
      else if (node.type == "if") {
        line += `if (${getNodeCode(node.condition, true)})\n`;
        
        line += `{${getBlockCode(node.trueBranch)}}`;
        
        if (node.falseBranch) {
          line += `else {${getBlockCode(node.falseBranch)}}`;
        }
        
        skipSemicolon = true;
      }
      
      if (!skipSemicolon)
        line += ';';
      return line;
    }
    
    function getBlockCode(node) {
     
     let code ='';
     while (node) {
        let line = getNodeCode(node);
        
        code = code + line;// + '\n';
        
        node = node.next;
      }
      return code;
    }

    let code = getBlockCode(tree.root);
    
    return `#include <iostream>
    using namespace std;
    int main(){${code}return 0;}`;
  }
}

module.exports = {
  Transpiler
};