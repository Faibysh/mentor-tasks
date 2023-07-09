export class StringBuilder {
  constructor(baseString = "") {
    this.value = baseString;
  }

  append(str) {
    this.value += str;
    return this;
  }

  prepend(str) {
    this.value = str + this.value;
    return this;
  }

  pad(str) {
    this.value = str + this.value + str;
    return this;
  }
}

export const builder = new StringBuilder(".");

builder.append("^").prepend("^").pad("=");

export const builderValue = builder.value;

const paragraph = document.querySelector("#task1 .text");
paragraph.textContent = builderValue;

console.log(builderValue);
