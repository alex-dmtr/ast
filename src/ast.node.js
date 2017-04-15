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

class AstNode_If extends AstNode {
  constructor({type, condition, trueBranch, falseBranch}) {
    super({type});
    this.condition = condition;
    this.trueBranch = trueBranch;
    this.falseBranch = falseBranch;
  }
}

module.exports = {
  AstNode,
  AstNode_Declare,
  AstNode_Function,
  AstNode_Expression,
  AstNode_Constant,
  AstNode_Variable,
  AstNode_If
};