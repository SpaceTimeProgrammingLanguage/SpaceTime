(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],3:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],4:[function(require,module,exports){
(function (process,global){// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
}).call(this,require("/Users/ken/.nvm/v0.10.25/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":3,"/Users/ken/.nvm/v0.10.25/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":2,"inherits":1}],5:[function(require,module,exports){
/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var Seq = [];

var FIB = {
	f: function(i)
	{
		if (i <= 1)
		{
			Seq[i] = 1;
		}
		else
		{
			Seq[i] = Seq[i - 2] + Seq[i - 1];
		}

		return Seq[i];
	}
};

module.exports = FIB;
},{}],6:[function(require,module,exports){
/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';
var M = require('./map');

var NATURAL = function()
{
	//return M.SEQ.i;
}();


module.exports = NATURAL;
},{"./map":11}],7:[function(require,module,exports){
/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';
var SEQ = {};

SEQ.i = 0;
SEQ.n = function(i)
{
	return SEQ[SEQ.i + i];
};

module.exports = SEQ;
},{}],8:[function(require,module,exports){
/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var doNothing = function(src, atr)
{
	return [];
};

module.exports = doNothing;
},{}],9:[function(require,module,exports){
/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./map');

var ifF = function(src, atr)
{
  //var bool = atr[0];
  M.$L('!!!!!!!!!! ifF   !!!!!!!!!!!!!!!!!!!!!!!!!!!');
  M.$L(src);
  M.$L(M.$type(src) === 'Array');

  M.$L('!!atr!!');
  M.$L(atr[0]); // [true]


  if (M.$content(M.map(atr[0], [M.MEMORY])))
  {
    return M.map(atr[1], [M.MEMORY]);
  }
  else
  {
    return M.map(src, [M.MEMORY]);
  }

};

module.exports = ifF;
},{"./map":11}],10:[function(require,module,exports){
/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./map');

var iterate = function(src, likeFibf)
{
	//var Seq = M.$content(SEQ);

	M.$L('=======ITERATE================');
	M.$L(M.SEQ);

	var F = function()
	{
		if (M.SEQ.i <= 1)
		{
			return 1;
		}
		else
		{
			return M.SEQ.n(-2) + M.SEQ.n(-1);
		}
	};


	return [F];
};

module.exports = iterate;
},{"./map":11}],11:[function(require,module,exports){
/* jslint node: true */
/* global $,describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = {};
module.exports = M;

var OUT;

M.debug = false; //just default, change this value @ test or app.js
var $W = M.$W = function(msg)
{
	console.log(msg);
};

var $L = M.$L = function(msg)
{
	if (M.debug)
	{
		if (typeof window === 'undefined')
		{
			var util = require('util');
			console.log(util.inspect(msg,
			{
				depth: 99,
				colors: true
			}));
		}
		else
		{
			console.log(msg);
		}
	}
};

var MEMORY = M.MEMORY = 'MEMORY';
var EACH = M.EACH = 'EACH';
var CONSOLE = M.CONSOLE = 'CONSOLE';

var FUNCTION_SEQUENCE = M.FUNCTION_SEQUENCE = 'FUNCTION_SEQUENCE';
var DATA_SEQUENCE = M.DATA_SEQUENCE = 'DATA_SEQUENCE';

var FUNCTION_COMPOSITION = M.FUNCTION_COMPOSITION = [];

var Val = [];
var VAL = M.VAL = function(index)
{
	return Val[index] || (Val[index] = {
		wrapped_value: []
	});
};



//see http://bonsaiden.github.io/JavaScript-Garden/#types.typeof
var $type = M.$type = function(obj)
{
	return Object
		.prototype
		.toString
		.call(obj)
		.slice(8, -1);
};


var isNatveFunction = M.isNatveFunction = function(el)
{
	return ($type(el) === 'Function');
};


//is Type Function is fundamental and used in $mapMEMORY, so cannot be exported
var isType = M.isType = function(src, atr)
{
	var clas;

	var isFunction = function(el)
	{
		if (el.length === 0)
		{
			return false;
		}
		else if (isNatveFunction(el[0]))
		{
			return true;
		}
		else
		{
			if (el[0].length > 1)
			{
				if (el[0][0] === FUNCTION_COMPOSITION)
				{
					return true;
				}
				else
				{
					return false;
				}
			}
			else
			{
				return false;
			}
		}
	};

	if ($type(src) === 'Array')
	{
		if (isFunction(src))
			clas = FUNCTION_SEQUENCE;
		else
			clas = DATA_SEQUENCE;
	}
	else
	{
		clas = $type(src);
	}

	return ((src !== undefined) && (src !== null) && (clas === atr));

};


var $push = M.$push = function(arr, data)
{
	arr[arr.length] = data;
};

var $pop = M.$pop = function(arr)
{
	var data = arr[arr.length - 1];
	arr.splice(arr.length - 1, 1);
	return data;
};


var $content = M.$content = function(seq)
{
	return seq[0];
};

M.map = function(src, atr, out)
{

	if (typeof out !== 'undefined')
	{
		OUT = out;
	}

	$L('map');
	$L(src);
	$L(atr);
	var $mapMEMORY = function(src)
	{
		$L('############## mapMEM ################');
		$L('----------- src --------------');
		$L(src);
		$L('------------------------------');

		if (isType(src, FUNCTION_SEQUENCE))
		{
			$L('@@@@@========  FUNCTION_SEQUENCE ======= @@@@@');
			$L(src);
			return src;
		}
		else if (isType(src, DATA_SEQUENCE))
		{
			$L('@@@@@======== DATA_SEQUENCE =========@@@@@');
			if (src.length === 0) //empty pair
			{
				return [];
			}
			else if ((src.length === 1) && (src[0] === FUNCTION_COMPOSITION))
			{
				$L('!!!!!!!!!!!!!!=====================src === [FUNCTION_COMPOSITION]!!!!!!!!!!!!!!');
				return $mapMEMORY($pop(FUNCTION_COMPOSITION));
			}
			else
			{
				$L('----------------------------------');
				var lastElement = src[src.length - 1];
				$L('!!!!!!!!!!!!!!lastElement');
				$L(lastElement);

				if (!isType(lastElement, FUNCTION_SEQUENCE))
				{
					$L('@@@@@ unOperatable DATA_SEQUENCE @@@@@');
					$L(src);
					return src;
				}
				else
				{
					$L('@@@@@ Operatable DATA_SEQUENCE (the lastElement== f)@@@@@');
					// src = [SRC, [plus, ATR]]
					var f = lastElement[0];
					var atr = lastElement[1];

					var srcsrc = src.slice(0, src.length - 1);

					var result;
					if (isNatveFunction(f)) // _f = plus
					{
						if (!isType(srcsrc, DATA_SEQUENCE))
							throw 'Invalid Format';
						//$L('---srcsrc--------');
						//$L(srcsrc);  [SRC]

						result = f(srcsrc, atr); //plus([1],[2])

						$L('---result--------');
						$L(result);
						return result;
					}
					else // _f = [FUNCTION_COMPOSITION,[plus, [1]],[plus, [2]]]
					{
						$L('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& Custom Function &&&&&');
						$L(f);

						// [FUNCTION_COMPOSITION] = srcsrc;

						$push(FUNCTION_COMPOSITION, srcsrc);

						for (var i = 0; i < atr.length; i++)
						{
							$push(VAL(i)
								.wrapped_value, atr[i]);
						}

						// f = _f[0][1][0];
						// result = f(srcsrc, atr); //plus([1],[2])

						result = $mapMEMORY(f);

						$L('---result--------');
						$L(result);
						return result;
					}

				}

			}
		}
		else
		{
			$L('@@@@@========= ATOM/OBJECT ========@@@@@');
			$L('---result--------');
			$L(src);

			if (src.hasOwnProperty('wrapped_value'))
			{
				return $pop(src.wrapped_value);
			}
			else
			{
				return src;
			}
		}

	};
	var $mapEACH = function(src)
	{
		//$L('---$mapEACH ');
		//$L(src);
		for (var i = 0; i < src.length; i++)
		{
			$mapMEMORY(src[i]);
		}
		return true;
	};



	var $mapCONSOLE = function(src)
	{
		//$L(' ---$mapCONSOLE  fn ----- ');

		var result = $mapMEMORY(src);

		M.$L(M.$content(result));
		var output = M.$construct(M.$content(result));

		var output1;

		if ($type(output) === 'String')
		{
			if (output.substring(0, 1) === '"')
				output1 = output.substring(1, output.length - 1);
			else
				output1 = output;
		}
		else
		{
			output1 = output;
		}

		M.$W('<@@@@@@@@@@@@@@@@@ $mapCONSOLE OUTPUT @@@@@@@@@@@@@@@@@>');
		M.$W(output1); //side effect

		if (typeof $ !== 'undefined')
		{
			var content = $(OUT)
				.val();
			$(OUT)
				.val(content + output1 + '\n');
		}

		return result;
	};

	if ($content(atr) === MEMORY)
	{
		return $mapMEMORY(src);
	}
	if ($content(atr) === EACH)
	{
		return $mapEACH(src);
	}
	if ($content(atr) === CONSOLE)
	{
		return $mapCONSOLE(src);
	}

};
},{"util":4}],12:[function(require,module,exports){
/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./map');

var minus = function(src, atr)
{
	var result = src - atr;

	return result;
};

module.exports = minus;
},{"./map":11}],13:[function(require,module,exports){
/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./map');

var plus = function(src, atr) //plus([1], [2]) = [3]
{
	M.$L('==========plus');
	M.$L('---src');
	M.$L(src);
	M.$L('---atr');
	M.$L(atr);

	var src1 = M.map(src, [M.MEMORY]);
	var atr1 = M.map(atr, [M.MEMORY]);

	M.$L('@@@src1');
	M.$L(src1);
	M.$L('@@@atr1');
	M.$L(atr1);

	if (!M.isType(atr1, M.DATA_SEQUENCE))
	{

		throw 'Invalid Format';
	}
	else if (atr1.length === 0)
	{
		throw 'atr is null Sequence (empty pair), invalid format  ';
	}
	else
	{


		if (atr1.length === 1)
		{
			var result;

			if (!M.isType(M.$content(src1), M.DATA_SEQUENCE))
			{
				result = M.$content(src1) + M.$content(atr1);
				// $L(result);  
				return [result];
			}
			else
			{
				var src2 = M.map(M.$content(src1), [M.MEMORY]);
				result = [];
				for (var i = 0; i < src2.length; i++)
				{
					result[i] = src2[i] + M.$content(atr1);
				}

				// $L('+++++++++++++++++++++++++++++');
				//$L(result)  
				return [result];
			}



		}
		else
		{
			//??
		}
	}


};

module.exports = plus;
},{"./map":11}],14:[function(require,module,exports){
/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./map');

var take = function(src, atr)
{
	var src1 = M.$content(M.map(src, [M.MEMORY]));
	var atr1 = M.$content(M.map(atr, [M.MEMORY]));

	if (M.isType(src1, M.DATA_SEQUENCE))
	{
		M.$L('-----take src is Array');
		M.$L('-----src1');
		M.$L(src1);
		M.$L('-----atr1');
		M.$L(atr1);

		return [src1.slice(0, atr1)];
	}
	else
	{
		M.$L('-----take src is Object');
		M.$L('' + src1);

		M.SEQ.i = 0;
		var out = [];

		while (true)
		{
			out[M.SEQ.i] = M.SEQ[M.SEQ.i] = src1();

			if (out.length === atr1)
				return [out];

			M.SEQ.i++;
		}
	}
};

module.exports = take;
},{"./map":11}],15:[function(require,module,exports){
     var SpaceTime_FunctionsDIR = './SpaceTime_Functions/';
     var SpaceTime_coreFile = 'map.js';
     console.log('{src f}   src -f-> ??');
     console.log('');
     console.log('SpaceTime modlue loading...');
      //var M = require(SpaceTime_FunctionsDIR + SpaceTime_coreFile);
      //require(STRING) must be raw STRING to be read by Browserify
     var M = require('./SpaceTime_Functions/map.js');
     module.exports = M;
     console.log('Function: map(core)');

     var loadModulesFactory;
     if (typeof window === 'undefined')
     {
       var modulePathHiddenFromBrowserify = './loadModulesFactory';
       loadModulesFactory = require(modulePathHiddenFromBrowserify);
     }
     else
     {
       loadModulesFactory = require('./loadModulesFactoryBrowserify');
     }

     var obj = loadModulesFactory(SpaceTime_FunctionsDIR, SpaceTime_coreFile, M);
     M = obj.M;
     var loadModules = M.loadModules = obj.func;


      //=====================================
     String.prototype.replaceAll = function(org, dest)
     {
       return this
         .split(org)
         .join(dest);
     };

     var sqSymbol = '_____sq_____';
     var sqKey = 'sq___';

      //==========================
     var cmtprts = ['//', '/*', '*/', '(', ')', '\n', ' ', '　'];
     var cmtprtsE = cmtprts.map(function(s, i)
     {
       return '______mark______' + i;
     });
      //==========================

     var restoreMark = function(src)
     {
       // "thisisareplacement"+i  restore to normal string
       var src1 = [];

       cmtprtsE.map(function(mark, mark_i)
       {
         var data;
         if (mark_i === 0)
         {
           data = src;
         }
         else
         {
           data = src1[mark_i - 1];
         }
         src1[mark_i] = data.replaceAll(mark, cmtprts[mark_i]);

       });
       return src1[src1.length - 1];
     };

     var $trim = M.$trim = function(src)
     {

       var strgs = src.match(/"(?:[^\\"]|\\.)*"/ig);
       var strgs1 = [];
       var src1 = [];

       var src2;
       // escape cmtprts  during each Strings
       if (strgs)
       {
         strgs.map(function(str, str_i)
         {
           var str1 = [];
           cmtprts.map(function(mark, mark_i)
           {
             var data;
             if (mark_i === 0)
             {
               data = str;
             }
             else
             {
               data = str1[mark_i - 1];
             }

             str1[mark_i] = data.replaceAll(mark, cmtprtsE[mark_i]);
           });

           strgs1[str_i] = str1[str1.length - 1];

           var data1;

           if (str_i === 0)
           {
             data1 = src;
           }
           else
           {
             data1 = src1[str_i - 1];
           }

           src1[str_i] = data1.replaceAll(strgs[str_i], strgs1[str_i]);

         });

         src2 = src1[src1.length - 1];
       }
       else
       {
         src2 = src;
       }

       // comment out removing
       var re2 = new RegExp('//.*?(?=[\\n\\r]+|$)|/[*](.|\n)*?[*]/', 'g');
       var src3 = src2
         .replace(re2, '');

       //beautifly
       var src4 = src3.replaceAll('　', ' '); //zenkaku>hankaku

       var src5 = src4.replaceAll('\n', ' '); //linebreak -> single space

       var src6 = src5.replace(/(\S)\(/g, '$1 ('); //foo(  -> foo (
       var src7 = src6.replace(/\)(\S)/g, ') $1'); //)foo  -> ) foo 

       var src8 = src7.replace(/[　\s]+/g, ' '); // trim extra spaces
       var src9 = src8.replace(/(\()\s+|\s+(\))/g, '$1$2'); //trim a space after '(' and before ')'.
       var src10 = src9.replace(/(\[)\s+|\s+(\])/g, '$1$2'); //trim a space after '[' and before ']'.



       return src10;

     };



     var $parse = M.$parse = function(src)
     {
       // M.$W('------------- parse ----------------');
       // M.$W(src);

       var maybeNumberString = function(src)
       {
         var s1 = src * 1;
         var s2 = '' + s1;
         if (src === s2) // naked number
         {
           return s1;
         }
         else if (src.indexOf('"') !== -1) // '"some string"'
         {
           return restoreMark(src.substring(1, src.length - 1));
         }
         else
         {
           var src1;

           if (src === '+')
             src1 = 'plus';
           else if (src === '-')
             src1 = 'minus';
           else
             src1 = src;

           return M[src1];
         }
       };


       //// M.$W("!!!!!!!!!!!src");
       // M.$W(src.length);

       if (src.indexOf('(') === -1)
       {
         return maybeNumberString(src);
       }
       else if (src.match(/().*/))
       {
         //   M.$W('src === ()');
         return [];
       }
       else
       {
         //  M.$W('some seq');

         var indexHead;
         var indexTail;
         var count = [];
         var previousCount;

         var space = [];
         for (var i = 0; i < src.length; i++)
         {
           // wt('> ' + src[i]);
           if (i === 0)
             previousCount = 0;
           else
             previousCount = count[i - 1];

           if ((previousCount === 1) && (src[i] === ' '))
             space[space.length] = i;

           if (src[i] === '(')
             count[i] = previousCount + 1;
           else if (src[i] === ')')
             count[i] = previousCount - 1;
           else
             count[i] = previousCount;

           if ((previousCount === 0) && (count[i] === 1))
           {
             indexHead = i;
           }

           if ((previousCount === 1) && (count[i] === 0))
           {
             indexTail = i;
           }

           //   wt('count ' + count[i]);

         }

         //  M.$W(indexHead);
         //  M.$W(indexTail);
         //  M.$W(space);

         var src1 = src.substring(indexHead + 1, indexTail);
         // M.$W("-----------src1");
         //  M.$W(src1);

         var array = [];

         if (space.length === 0)
         {
           array[0] = maybeNumberString(src1);
           // M.$W('---return');
           // M.$W(array);
           return array;

         }
         else
         {
           for (var j = 0; j < space.length; j++)
           {
             if (j === 0)
             {
               array[array.length] = $parse(src.substring(indexHead + 1, space[j]));
             }
             if (j === space.length - 1)
             {
               array[array.length] = $parse(src.substring(space[j] + 1, indexTail));
             }
             else
             {
               array[array.length] = $parse(src.substring(space[j] + 1, space[j + 1]));
             }
           }
           M.$W('---return');
           M.$W(array);

           return array;
         }
       }

     };

     var $construct = M.$construct = function(result)
     {
       var result1;
       if (M.$type(result) === 'Array')
       {
         result1 = '( ';
         for (var i = 0; i < result.length; i++)
         {
           result1 += $construct(result[i]);
           result1 += ' ';
         }

         result1 += ')';
       }
       else if (M.$type(result) === 'String')
       {
         result1 = '"' + result + '"';
       }
       else if (M.$type(result) === 'Function')
       {
         result1 = 'Function';
       }
       else
       {
         result1 = result;
       }

       return result1;
     };



      //======================================



     if (typeof describe === 'undefined')
     {
       loadModules(function()
       {
         M.$W('------------- SpaceTime Module is Ready ----------------');



         //============================================
         // var src = [1, [M.plus, [2]], [M.map, [M.CONSOLE]]];
         // var src = ' ( 1(+(2(+(3)))) (map(CONSOLE)) ) ';

         var src = '(  )   ';
         //  var src = ' (FIB (take(10)) (map(CONSOLE))) ';
         //var src = ' (SEQ  (iterate ())  (take(10)) (map(CONSOLE))) ';

         // var src = ' (NATURAL  (take(10)) (map(CONSOLE))) ';

         /*  (
             FUNCTION_COMPOSITION VAL0(get(i(-(2))))(+(VAL0(get(i(-(1))))))
             (ifF((i <= 1)(1))))

         )*/

         M.debug = false;
         var src1 = $parse($trim(src));
         console.log('src1 to mamMemory');
         console.log(src1);
         M.map(src1, [M.MEMORY]);


         //------------------------------------------------------------------
       });
     }

      //=========================================
},{"./SpaceTime_Functions/map.js":11,"./loadModulesFactoryBrowserify":16}],16:[function(require,module,exports){
var loadModulesFactory = function(SpaceTime_FunctionsDIR, SpaceTime_coreFile, M)
{
  return {
    M: M,
    func: function(f)
    {
      M.doNothing = require('./SpaceTime_Functions/doNothing.js');
      M.FIB = require('./SpaceTime_Functions/FIB.js');
      M.ifF = require('./SpaceTime_Functions/ifF.js');
      M.iterate = require('./SpaceTime_Functions/iterate.js');
      M.minus = require('./SpaceTime_Functions/minus.js');
      M.NATURAL = require('./SpaceTime_Functions/NATURAL.js');
      M.plus = require('./SpaceTime_Functions/plus.js');
      M.SEQ = require('./SpaceTime_Functions/SEQ.js');
      M.take = require('./SpaceTime_Functions/take.js');

      console.log('SpaceTime modlue load complete.');
      f();
    }
  };
};

module.exports = loadModulesFactory;
},{"./SpaceTime_Functions/FIB.js":5,"./SpaceTime_Functions/NATURAL.js":6,"./SpaceTime_Functions/SEQ.js":7,"./SpaceTime_Functions/doNothing.js":8,"./SpaceTime_Functions/ifF.js":9,"./SpaceTime_Functions/iterate.js":10,"./SpaceTime_Functions/minus.js":12,"./SpaceTime_Functions/plus.js":13,"./SpaceTime_Functions/take.js":14}],17:[function(require,module,exports){
/* jslint node: true */
/* global jQuery,$, window, document, alert, describe, it, before, beforeEach, after, afterEach */

'use strict';

var debug = false;

var M = require('../../app.js');

$(document)
	.ready(function()
	{
		init();
	});

var init = function()
{

	setTimeout(function()
	{
		$('#input1')
			.val('("Hello world"  (map (CONSOLE)) )');
		$('#input1')
			.focusEnd();

		evaluation();
	}, 2000);

	$(document)
		.on('input propertychange', '#input1', function()
		{
			evaluation();
		});

	var evaluation = function()
	{
		$('#console1')
			.val('');

		var src = $('#input1')
			.val();

		var src1 = M.$parse(M.$trim(src));

		//console.log('src1 to mamMemory');
		//console.log(src1);

		var result = M.map(src1, [M.MEMORY], '#console1');

		$('#evaluation1')
			.val(M.$construct(result));
	};

};


$.fn.focusEnd = function()
{
	var value = $(this)
		.val();
	$(this)
		.val('');
	$(this)
		.focus();
	$(this)
		.val(value);
	return this;
}
},{"../../app.js":15}]},{},[17])