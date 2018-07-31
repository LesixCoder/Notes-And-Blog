var util = {
  reverse(str) {
    if(typeof str !== "string") throw "util.reverse should pass a string argument";
    if(str.length <= 1) return str;
    else return str.split("").reverse().join("");
  }
}