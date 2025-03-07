import { ExpressionTree, Node, Stack } from "./calculator-logic.js";

const numbersArr = Array.from(document.getElementsByClassName("number"));
const operatorsArr = Array.from(document.getElementsByClassName("operator"));
const parenthesisArr = Array.from(
  document.getElementsByClassName("parenthesis")
);
const numberStrs = "0123456789".split("");

const data = {
  displayString: "0",

  appendStringNum: (newChar) => {
    if (newChar === ".") {
      const lastToken = data.displayString.split(/[\+\-\*\/]/).pop();
      if (lastToken.includes(".")) {
        return;
      }

      if (lastToken === "") {
        data.displayString += "0";
      }
    }

    if (numberStrs.includes(newChar)) {
      if (data.displayString === "0" && newChar !== ".") {
        data.displayString = "";
      }
    }

    data.displayString += newChar;
    data.updateDisplay();
  },

  appendStringOperator: (newChar) => {
    const lastChar = data.displayString.slice(-1);
    if (numberStrs.includes(lastChar) || lastChar === ")") {
      data.displayString += newChar;
    } else if ("+-*/".includes(lastChar)) {
      data.displayString = data.displayString.slice(0, -1) + newChar;
    }
    data.updateDisplay();
  },

  appendStringParenthesis: (newChar) => {
    if (newChar === ")") {
      if (
        data.displayString.split("(").length <=
        data.displayString.split(")").length
      ) {
        //if there are not enough open parenthesis to add a closing parenthesis terminate early
        return;
      }
      if (
        operatorsArr
          .map((operator) => operator.innerText)
          .includes(data.displayString[data.displayString.length - 1])
      ) {
        //early termination for adding parenthesis after operator
        return;
      }
    }
    if (data.displayString === "0") {
      data.displayString = "";
      data.displayString += newChar;
      return;
    }

    data.displayString += newChar;

    data.updateDisplay();
  },

  clearDisplay: () => {
    data.displayString = "0";
    data.updateDisplay();
  },

  evaluateExpression: () => {
    try {
      const tree = new ExpressionTree(data.displayString);
      data.displayString = String(tree.evaluate());
    } catch (error) {
      data.displayString = "Error!";
    }
    data.updateDisplay();
  },

  updateDisplay: () => {
    const display = document.getElementById("display");
    display.innerText = data.displayString;
  },
};

const display = document.getElementById("display");
display.innerText = data.displayString;

numbersArr.map((elem, i) => {
  elem.addEventListener("click", (evt) => {
    data.appendStringNum(elem.innerText);
  });
});

operatorsArr.map((elem, i) => {
  elem.addEventListener("click", (evt) => {
    data.appendStringOperator(elem.innerText);
  });
});

parenthesisArr.map((elem, i) => {
  elem.addEventListener("click", (evt) => {
    data.appendStringParenthesis(elem.innerText);
  });
});

document
  .querySelector(".decimal")
  .addEventListener("click", () => data.appendStringNum("."));
document
  .querySelector(".clear")
  .addEventListener("click", () => data.clearDisplay());
document
  .querySelector(".equals")
  .addEventListener("click", () => data.evaluateExpression());
