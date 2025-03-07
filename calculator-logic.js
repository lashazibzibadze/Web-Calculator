export class Node {
  constructor(val = null, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
    this.next = null;
  }
}

export class Stack {
  constructor() {
    this.head = null;
  }

  push(item) {
    item.next = this.head;
    this.head = item;
  }

  pop() {
    if (!this.head) return null;
    const item = this.head;
    this.head = this.head.next;
    return item;
  }

  isEmpty() {
    return !this.head;
  }
}

export class ExpressionTree {
  constructor(expression) {
    this.expression = expression;
    this.root = this.buildTree();
  }

  infixToPostfix() {
    const precedence = { "+": 1, "-": 1, "*": 2, "/": 2 };
    const output = [];
    const operators = [];
    const tokens = this.expression.match(/(\d+(\.\d+)?|\+|\-|\*|\/|\(|\))/g);

    tokens.forEach((token) => {
      if (!isNaN(token)) {
        output.push(token);
      } else if (token === "(") {
        operators.push(token);
      } else if (token === ")") {
        while (operators.length && operators[operators.length - 1] !== "(") {
          output.push(operators.pop());
        }
        operators.pop();
      } else {
        while (
          operators.length &&
          precedence[operators[operators.length - 1]] >= precedence[token]
        ) {
          output.push(operators.pop());
        }
        operators.push(token);
      }
    });

    while (operators.length) {
      output.push(operators.pop());
    }

    return output;
  }

  buildTree() {
    const postfix = this.infixToPostfix();
    const stack = new Stack();

    postfix.forEach((token) => {
      if (!isNaN(token)) {
        stack.push(new Node(Number(token)));
      } else {
        const node = new Node(token);
        node.right = stack.pop();
        node.left = stack.pop();
        stack.push(node);
      }
    });

    return stack.pop();
  }

  evaluate(node = this.root) {
    if (!node) return 0;
    if (!node.left && !node.right) return node.val;

    const leftVal = this.evaluate(node.left);
    const rightVal = this.evaluate(node.right);

    switch (node.val) {
      case "+":
        return leftVal + rightVal;
      case "-":
        return leftVal - rightVal;
      case "*":
        return leftVal * rightVal;
      case "/":
        if (rightVal === 0) throw new Error("Error!");
        return leftVal / rightVal;
    }
  }
}
