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

    // parses lines
    // parent = parent node (used for if, while etc)
    function parseLines(startIndex, parent) {
      let firstNode;
      
      firstNode = tree.createNode();
      
      let node = firstNode;
      
      let _i;
      
      console.log("start at", startIndex)
      for (_i = startIndex; _i < lines.length; _i++)
      {
        var line = lines[_i];
        winston.info(`line ${_i}`, line);
        
         var tokens = line.split(/,| |\t/);
        tokens = tokens.filter((token) => token !== "");
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
        else if (tokens[0] == "sfarsit" && tokens.length == 1)
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
          
          let trueBranch_Info = parseLines(_i+1, node);
          let dummyNode = tree.createNode();
          if (lines[trueBranch_Info.exitIndex]=='altfel')
          {
            let falseBranch_Info = parseLines(trueBranch_Info.exitIndex+1, node);
          
            // trueBranch_Info.lastNode.next = falseBranch_Info.lastNode.next = dummyNode; 
            let ifNode = tree.createNode(
              {
                type:'if',
                condition: conditionNode, 
                trueBranch: trueBranch_Info.firstNode,
                falseBranch: falseBranch_Info.firstNode,
                next: dummyNode
              });
            
            node.next = ifNode;
            node = dummyNode;
            _i = falseBranch_Info.exitIndex;
          }
          else {
            // trueBranch_Info.nextNode = dummyNode;
            
            let ifNode = tree.createNode({
              type: 'if',
              condition: conditionNode,
              trueBranch: trueBranch_Info.firstNode,
              falseBranch: null,
              next: dummyNode
            });
            
            node.next = ifNode;
            node = dummyNode;
            _i = trueBranch_Info.exitIndex;
          }
          
          console.log("put if node");
        }
        else if (tokens[0] == "cat" && tokens[1] == "timp") {
          assert(tokens[tokens.length-1] === 'executa', "expected executa");
          
          var exprTokens = _.slice(tokens, 2, tokens.length-1);
          
          let conditionNode = tree.parseExpression(exprTokens);
          
          let loop_Info = parseLines(_i+1, node);
          
          let dummyNode = tree.createNode();
          
          let whileNode = tree.createNode({
            type: 'while',
            condition: conditionNode,
            loop: loop_Info.firstNode,
            next: dummyNode
          });
          
          node.next = whileNode;
          node = dummyNode;
          _i = loop_Info.exitIndex;
        }
        else if (tokens[0] == "altfel" || tokens[0] == "sfarsit") {
          break;
        }
        else {
          let exprNode = tree.parseExpression(tokens);
          let nextNode = exprNode;
          node.next = nextNode;
          node = node.next;
        }
      }
      return {
        firstNode,
        lastNode: node,
        exitIndex: _i
      };
    }
    
    parseLines(0, null);

    
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