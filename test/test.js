// test.js

assert.equal = equal;
assert.ok = assert;

var exported = ("undefined" !== typeof require) ? require("../int64-buffer") : window;
var UInt64BE = exported.UInt64BE;
var Int64BE = exported.Int64BE;
var reduce = Array.prototype.reduce;
var forEach = Array.prototype.forEach;
var BUFFER = ("undefined" !== typeof Buffer) && Buffer;
var ARRAYBUFFER = ("undefined" !== typeof ArrayBuffer) && ArrayBuffer;

var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
var POS1 = [0, 0, 0, 0, 0, 0, 0, 1];
var NEG1 = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];
var POSB = [0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF];
var NEGB = [0xFE, 0xDC, 0xBA, 0x98, 0x76, 0x54, 0x32, 0x10];
var FLOAT_MAX = Math.pow(2, 53);

var itBuffer = BUFFER ? it : it.skip;
var itArrayBuffer = ARRAYBUFFER ? it : it.skip;

describe("UInt64BE", function() {
  it("UInt64BE().toNumber()", function() {
    var val = UInt64BE(1).toNumber();
    assert.ok("number" === typeof val);
    assert.equal(val, 1);
  });

  it("UInt64BE().toString()", function() {
    var val = UInt64BE(1).toString();
    assert.ok("string" === typeof val);
    assert.equal(val, "1");
  });

  it("UInt64BE().toString(10)", function() {
    var col = 1;
    var val = 1;
    var str = "1";
    while (val < FLOAT_MAX) {
      assert.equal(UInt64BE(val).toString(10), str);
      assert.equal(UInt64BE(str).valueOf(), val);
      col = (col + 1) % 10;
      val = val * 10 + col;
      str += col;
    }
    assert.equal(toHex(UInt64BE(UInt64BE(POSB).toString(10)).buffer), toHex(POSB));
    assert.equal(toHex(UInt64BE(UInt64BE(NEGB).toString(10)).buffer), toHex(NEGB));
  });

  it("UInt64BE().toString(16)", function() {
    var val = 1;
    var col = 1;
    var str = "1";
    while (val < FLOAT_MAX) {
      assert.equal(UInt64BE(val).toString(16), str);
      col = (col + 1) % 10;
      val = val * 16 + col;
      str += col;
    }
    assert.equal(toHex(Int64BE(Int64BE(POSB).toString(10)).buffer), toHex(POSB));
    assert.equal(toHex(Int64BE(Int64BE(NEGB).toString(10)).buffer), toHex(NEGB));
  });

  it("UInt64BE().toArray()", function() {
    var val = UInt64BE(1).toArray();
    assert.ok(val instanceof Array);
    assert.equal(toHex(val), toHex(POS1));
  });

  itBuffer("UInt64BE().toBuffer()", function() {
    var val = UInt64BE(1).toBuffer();
    assert.ok(BUFFER.isBuffer(val));
    assert.equal(toHex(val), toHex(POS1));
  });

  itArrayBuffer("UInt64BE().toArrayBuffer()", function() {
    var val = UInt64BE(1).toArrayBuffer();
    assert.ok(val instanceof ArrayBuffer);
    assert.equal(toHex(new Uint8Array(val)), toHex(POS1));
  });
});

describe("Int64BE", function() {
  it("Int64BE().toNumber()", function() {
    var val = Int64BE(-1).toNumber();
    assert.ok("number" === typeof val);
    assert.equal(val, -1);
  });

  it("Int64BE().toString()", function() {
    var val = Int64BE(-1).toString();
    assert.ok("string" === typeof val);
    assert.equal(val, "-1");
  });

  it("Int64BE().toString(10)", function() {
    var col = 1;
    var val = -1;
    var str = "-1";
    while (val > FLOAT_MAX) {
      assert.equal(Int64BE(val).toString(10), str);
      assert.equal(Int64BE(str).valueOf(), val);
      col = (col + 1) % 10;
      val = val * 10 - col;
      str += col;
    }
  });

  it("Int64BE().toString(16)", function() {
    var col = 1;
    var val = -1;
    var str = "-1";
    while (val > FLOAT_MAX) {
      assert.equal(Int64BE(val).toString(16), str);
      col = (col + 1) % 10;
      val = val * 16 - col;
      str += col;
    }
  });

  it("Int64BE().toArray()", function() {
    var val = Int64BE(-1).toArray();
    assert.ok(val instanceof Array);
    assert.equal(toHex(val), toHex(NEG1));
  });

  itBuffer("Int64BE().toBuffer()", function() {
    var val = Int64BE(-1).toBuffer();
    assert.ok(BUFFER.isBuffer(val));
    assert.equal(toHex(val), toHex(NEG1));
  });

  itArrayBuffer("Int64BE().toArrayBuffer()", function() {
    var val = Int64BE(-1).toArrayBuffer();
    assert.ok(val instanceof ArrayBuffer);
    assert.equal(toHex(new Uint8Array(val)), toHex(NEG1));
  });
});

describe("UInt64BE(array)", function() {
  forEach.call([
    [0x0000000000000000, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0x0000000000000001, 0, 0, 0, 0, 0, 0, 0, 1], // 1
    [0x4000000000000000, 0x40, 0, 0, 0, 0, 0, 0, 0],
    [0x8000000000000000, 0x80, 0, 0, 0, 0, 0, 0, 0]
  ], function(exp) {
    var val = exp.shift();
    it(toHex(exp), function() {
      var c = new UInt64BE(exp);
      assert.equal(toHex(c.buffer), toHex(exp));
      assert.equal(c - 0, val);
      assert.equal(c.toString(16), toString16(val));
    });
  });
});

describe("Int64BE(array)", function() {
  forEach.call([
    [0x0000000000000000, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0x0000000000000001, 0, 0, 0, 0, 0, 0, 0, 1], // 1
    [0x4000000000000000, 0x40, 0, 0, 0, 0, 0, 0, 0],
    [-1, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
  ], function(exp) {
    var val = exp.shift();
    it(toHex(exp), function() {
      var c = new Int64BE(exp);
      assert.equal(toHex(c.buffer), toHex(exp));
      assert.equal(c - 0, val);
      assert.equal(c.toString(16), toString16(val));
    });
  });
});

describe("UInt64BE(high1)", function() {
  reduce.call([
    [0, 0, 0, 0, 0, 0, 0, 1], // 1
    [0, 0, 0, 0, 0, 0, 1, 0], // 256
    [0, 0, 0, 0, 0, 1, 0, 0], // 65536
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0]
  ], function(val, exp) {
    it(toHex(exp), function() {
      var c = new UInt64BE(val);
      assert.equal(toHex(c.buffer), toHex(exp));
      assert.equal(c - 0, val);
      assert.equal(c.toString(16), toString16(val));
    });
    return val * 256;
  }, 1);
});

describe("UInt64BE(high32)", function() {
  reduce.call([
    [0, 0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF],
    [0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF, 0],
    [0, 0, 0xFF, 0xFF, 0xFF, 0xFF, 0, 0],
    [0, 0xFF, 0xFF, 0xFF, 0xFF, 0, 0, 0],
    [0xFF, 0xFF, 0xFF, 0xFF, 0, 0, 0, 0]
  ], function(val, exp) {
    it(toHex(exp), function() {
      var c = new UInt64BE(val);
      assert.equal(toHex(c.buffer), toHex(exp));
      assert.equal(c - 0, val);
      assert.equal(c.toString(16), toString16(val));
    });
    return val * 256;
  }, 0xFFFFFFFF);
});

describe("Int64BE(low1)", function() {
  reduce.call([
    [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE], // -2
    [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE, 0xFF], // -257
    [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE, 0xFF, 0xFF], // -65537
    [0xFF, 0xFF, 0xFF, 0xFF, 0xFE, 0xFF, 0xFF, 0xFF],
    [0xFF, 0xFF, 0xFF, 0xFE, 0xFF, 0xFF, 0xFF, 0xFF],
    [0xFF, 0xFF, 0xFE, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
    [0xFF, 0xFE, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
    [0xFE, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
  ], function(val, exp) {
    it(toHex(exp), function() {
      var c = new Int64BE(val);
      assert.equal(toHex(c.buffer), toHex(exp));
      assert.equal(c - 0, val);
    });
    return (val * 256) + 255;
  }, -2);
});

describe("Int64BE(low31)", function() {
  reduce.call([
    [0xFF, 0xFF, 0xFF, 0xFF, 0x80, 0, 0, 0],
    [0xFF, 0xFF, 0xFF, 0x80, 0, 0, 0, 0xFF],
    [0xFF, 0xFF, 0x80, 0, 0, 0, 0xFF, 0xFF],
    [0xFF, 0x80, 0, 0, 0, 0xFF, 0xFF, 0xFF],
    [0x80, 0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF]
  ], function(val, exp) {
    it(toHex(exp), function() {
      var c = new Int64BE(val);
      assert.equal(toHex(c.buffer), toHex(exp));
      assert.equal(c - 0, val);
    });
    return (val * 256) + 255;
  }, -2147483648);
});


describe("Int64BE(0)", function() {
  forEach.call([
    0, 0.5, "0", NaN, Infinity, void 0, null
  ], function(val) {
    var view = ("string" === typeof val) ? '"' + val + '"' : val;
    it(toHex(ZERO) + " = " + view, function() {
      var c = new UInt64BE(val);
      assert.equal(toHex(c.buffer), toHex(ZERO));
      assert.equal(c - 0, 0);
    });
  });
});

describe("Int64BE(1)", function() {
  forEach.call([
    1, 1.5, "1", true
  ], function(val) {
    var view = ("string" === typeof val) ? '"' + val + '"' : val;
    it(toHex(POS1) + " = " + view, function() {
      var c = new UInt64BE(val);
      assert.equal(toHex(c.buffer), toHex(POS1));
      assert.equal(c - 0, 1);
    });
  });
});

function toHex(array) {
  return Array.prototype.map.call(array, function(val) {
    return val > 16 ? val.toString(16) : "0" + val.toString(16);
  }).join("");
}

function toString16(val) {
  var str = val.toString(16);
  if (str.indexOf("e+") < 0) return str;
  // IE8-10 may return "4(e+15)" style of string
  return Math.floor(val / 0x100000000).toString(16) + lpad((val % 0x100000000).toString(16), 8);
}

function lpad(str, len) {
  return "00000000".substr(0, len - str.length) + str;
}

function assert(value) {
  if (!value) throw new Error(value + " = " + true);
}

function equal(actual, expected) {
  if (actual != expected) throw new Error(actual + " = " + expected);
}
