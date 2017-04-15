var winston = require('winston');
var _ = require('lodash');

// import {AstNode, AstNode_Constant, AstNode_Declare, AstNode_Expression,
// AstNode_Function, AstNode_Variable} from './ast.node';
var NodeTypes = require('./ast.node');
var AstNode = NodeTypes.AstNode;
var AstNode_Constant = NodeTypes.AstNode_Constant;
var AstNode_Declare = NodeTypes.AstNode_Declare;
var AstNode_Expression = NodeTypes.AstNode_Expression;
var AstNode_Function = NodeTypes.AstNode_Function;
var AstNode_Variable = NodeTypes.AstNode_Variable;


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

module.exports = {
  AstTree
};