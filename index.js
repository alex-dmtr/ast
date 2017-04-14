'use strict';

var winston = require('winston');
var _ = require('lodash');

class AstNode {
  constructor({type}) {
    this.type = type;
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
  constructor({type}) {
    super({type});
  }
}
class AstTree {
  constructor() {
    this.root = null;
  }
  
  createNode(options) {
    if (options.type === 'block-start')
      return new AstNode(options);
    else if (options.type == 'declare')
      return new AstNode_Declare(options);
    else if (options.type == 'function')
      return new AstNode_Function(options);
    else if (options.type == 'expression')
      return new AstNode_Expression(options);
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
      else {
        let nextNode = tree.createNode({type: 'expression'});
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
      console.log('|')
      console.log('|')
      console.log('V')
      node = node.next;
    }
  }
}

let tree = Parser.parse(`
  inceput
  intreg a
  a <- 2 + 2
  afisare a
  sfarsit
`);

Parser.printTree(tree);