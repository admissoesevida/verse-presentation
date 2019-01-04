Object.prototype.equalsTo = function(object) {
  return JSON.stringify(this) === JSON.stringify(object);
};

String.prototype.toNumber = function(padSize = 2, padString = '0') {
  return this.padStart(padSize, padString);
};
