'use strict';

var winston = require('winston');
var _ = require('lodash');
var fs = require('fs');

class AstNode {
  constructor({type}) {
    this.type = type
    this.next = null;
    
  }
}

class AstNode_Declare extends AstNode {
  constructor({type, varType, registers}) {
    super({type});
    this.varType = varType;
    this.registers = registers || [];
  }
}

class AstNode_Function extends AstNode {
  constructor({type, functionName, parameters}) {
    super({type});
    this.functionName = functionName;
    this.parameters = parameters;
  }
}

class AstNode_Expression extends AstNode {
  constructor({type, children, operator}) {
    super({type});
    this.children = children;
    this.operator = operator;
  }
}

class AstNode_Constant extends AstNode {
  constructor({type, value}) {
    super({type});
    this.value = value;
  }
}

class AstNode_Variable extends AstNode {
  constructor({type, value}) {
    super({type});
    this.value = value;
  }
}
class AstTree {
  constructor() {
    this.root = null;
  }
  
  createNode(options) {
    // console.log(`create ${options.type}`);
    if (options.type === 'block-start')
      return new AstNode(options);
    else if (options.type == 'declare')
      return new AstNode_Declare(options);
    else if (options.type == 'function')
      return new AstNode_Function(options);
    else if (options.type == 'expression')
      return new AstNode_Expression(options);
    else if (options.type == 'constant')
      return new AstNode_Constant(options);
    else if (options.type == 'variable') {
      return new AstNode_Variable(options);
    }
    else if (options.type == 'end')
      return new AstNode(options);
  }
  
  // returns a node
  parseExpression(tokens) {
    
    function findOperator(op) {
      let k = 0;
      
      let i = tokens.length-1;
      while (i >= 0) {
        if (tokens[i] === ')')
          k++;
        else if (tokens[i] === '(')
          k--;
        else if (_.some(op.symbols, (symbol) => symbol === tokens[i]) && k === 0)
          return i;
      
        i--;
      }
      
      return -1;
    }
    
    function isLetter(str) {
     return (str.match(/[a-z]/i)) !== null;
  }
    var ops = [
      {
        type: 'assign',
        symbols: ['<-', ':='],
        priority: 0
      },
      {
        type: 'addition',
        symbols: ['+'],
        priority: 1
      }
      ];
      
    // console.log(tokens)
    var foundOps = ops.map((op) => {
      let index = findOperator(op);
      op.index = index;
      
      return op;
    });
    
    foundOps = _.filter(foundOps, (op) => op.index !== -1);
    foundOps = _.sortBy(foundOps, 'priority');
    
    var foundOp = _.head(foundOps);
    // console.log(foundOp);
    
    // console.log(tokens, foundOp == null);
    if (foundOp == null)
    {
        if (!isLetter(tokens[0][0]))
          return this.createNode({type: 'constant', value: parseFloat(tokens[0])});
        else
          return this.createNode({type: 'variable', value: tokens[0]});
     
    }
    else
    {
    
      var left = this.parseExpression(_.slice(tokens, 0, foundOp.index));
      var right = this.parseExpression(_.slice(tokens, foundOp.index+1));
      
      // console.log('left is ', left);
      // console.log('right is ', right);
      return this.createNode(
        {type: 'expression', 
        children: [left, right],
        operator: foundOp.type
      });
    
    }
  }
}



class Parser {
  static parse(script) {
    let lines = script.trim().split('\n').map((line) => {
      return line.trim();
    });
    
    let tree = new AstTree();
    let node = null;
    
    lines.forEach((line) => {
      var tokens = line.split(' ');
      
      if (tokens[0] == "inceput")
      {
        tree.root = tree.createNode({type:'block-start'});
        node = tree.root;
      }
      else if (tokens[0] == "intreg")
      {
        let nextNode = tree.createNode({type: 'declare', varType: 'int', registers: _.takeRight(tokens, tokens.length-1)});
        node.next = nextNode;
        node = node.next;
      }
      else if (tokens[0] == "afisare")
      {
        let nextNode = tree.createNode({type: 'function', functionName: 'print', parameters: _.takeRight(tokens, tokens.length-1)});
        node.next = nextNode;
        node = node.next;
      }
      else if (tokens[0] == "sfarsit")
      {
        let nextNode = tree.createNode({type: 'end'});
        node.next = nextNode;
        node = node.next;
      }
      else {
        let exprNode = tree.parseExpression(tokens);
        let nextNode = exprNode;
        node.next = nextNode;
        node = node.next;
      }
      
    });
    
    return tree;
  }
  
  static printTree(tree) {
    let node = tree.root;
    
    while (node) {
      console.log(_.pickBy(node, (value, key) => key != 'next'));
      console.log('|');
      console.log('|');
      console.log('V');
      node = node.next;
    }
  }
}

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

let script = fs.readFileSync('./pseudocod.txt');
let tree = Parser.parse(script.toString());
// Parser.printTree(tree);
// console.log(Transpiler.transpileToCpp(tree));

fs.writeFileSync('./main.cpp', Transpiler.transpileToCpp(tree));