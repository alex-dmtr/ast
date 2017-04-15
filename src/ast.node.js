class AstNode {
  constructor(options) {
    this.type = options.type;
    this.next = options.next;
    
  }
}

class AstNode_Declare extends AstNode {
  /*
    type,
    varType,
    registers
  */
  constructor(options) {
    super(options);
    this.varType = options.varType;
    this.registers = options.registers || [];
  }
}

class AstNode_Function extends AstNode {
  /*
    type,
    functionName,
    parameters
  */
  constructor(options) {
    super(options);
    this.functionName = options.functionName;
    this.parameters = options.parameters;
  }
}

class AstNode_Expression extends AstNode {
  /*
    type,
    children,
    operator
  */
  constructor(options) {
    super(options);
    this.children = options.children;
    this.operator = options.operator;
  }
}

class AstNode_Constant extends AstNode {
  /*
    type,
    value
  */
  constructor(options) {
    super(options);
    this.value = options.value;
  }
}

class AstNode_Variable extends AstNode {
  /*
    type,
    value
  */
  constructor(options) {
    super(options);
    this.value = options.value;
  }
}

class AstNode_If extends AstNode {
  /*
    type,
    condition,
    trueBranch,
    falseBranch
  */
  constructor(options) {
    super(options);
    this.condition = options.condition;
    this.trueBranch = options.trueBranch;
    this.falseBranch = options.falseBranch;
  }
}

class AstNode_While extends AstNode {
  /*
    type,
    condition
    loop
  */
  constructor(options) {
    super(options);
    this.condition = options.condition;
    this.loop = options.loop;
  }
}

module.exports = {
  AstNode,
  AstNode_Declare,
  AstNode_Function,
  AstNode_Expression,
  AstNode_Constant,
  AstNode_Variable,
  AstNode_If,
  AstNode_While
};