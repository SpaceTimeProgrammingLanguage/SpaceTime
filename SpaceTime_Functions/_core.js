/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var debug = false;

var M = {};
module.exports = M;


var $W = M.$W = function(msg)
{
	console.log(msg);
};

var $L = M.$L = function(msg)
{
	if (debug)
	{
		var util = require('util');
		console.log(util.inspect(msg,
		{
			depth: 99,
			colors: true
		}));
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


//is Type Function is foundamental and used in $mapMEMORY, so cannot be exported
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


var $mapMEMORY = M.$mapMEMORY = function(src)
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
				var _f = lastElement[0];
				var atr = lastElement[1];

				var srcsrc = src.slice(0, src.length - 1);

				var f;

				var result;
				if (isNatveFunction(_f)) // _f = plus
				{
					f = _f;
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
					$L(_f);

					// [FUNCTION_COMPOSITION] = srcsrc;

					$push(FUNCTION_COMPOSITION, srcsrc);

					for (var i = 0; i < atr.length; i++)
					{
						$push(VAL(i)
							.wrapped_value, atr[i]);
					}

					// f = _f[0][1][0];
					// result = f(srcsrc, atr); //plus([1],[2])

					result = $mapMEMORY(_f);

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


var $mapEACH = M.$mapEACH = function(src)
{
	$L('---$mapEACH ');
	$L(src);
	for (var i = 0; i < src.length; i++)
	{
		$mapMEMORY(src[i]);
	}　
	return true;
};


var $mapCONSOLE = M.$mapCONSOLE = function(src)
{
	$L(' ---$mapCONSOLE  fn ----- ');

	var result = $mapMEMORY(src);

	$L('<@@@@@@@@@@@@@@@@@ $mapCONSOLE OUTPUT @@@@@@@@@@@@@@@@@>');
	$W($content(result)); //side effect

	return result;
};

//======================================



var Seq = [];

var NATURAL = M.NATURAL = {
	f: function(i)
	{
		return i;
	}
};

var FIB = M.FIB = {
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



var bindClass = function(a)
{
	var x = a;

	var obj = {
		val: function()
		{
			return x;
		}
	};

	return obj;

};