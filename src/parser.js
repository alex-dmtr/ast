var _ = require('lodash');
var winston = require('winston');
var assert = require('assert');

var AstTree = require('./ast.tree').AstTree;

class Parser {
  static parse(script) {
    let lines = script.trim().split('\n').map((line) => {
      return line.trim();
    });
    
    lines = lines.filter((line) => line !== "");
    
    let tree = new AstTree();
    let node = null;
    
    lines.forEach((line) => {
      var tokens = line.split(/,| |\t/);
      
      // console.log(tokens);
      
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
      else if (tokens[0] == "daca")
      {
        assert(tokens[tokens.length-1] === 'atunci', "expected atunci");
        var exprTokens = _.slice(tokens, 1, tokens.length-1);
       
        let conditionNode = tree.parseExpression(exprTokens);
  
        node.next = conditionNode;
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

module.exports = {
  Parser
};