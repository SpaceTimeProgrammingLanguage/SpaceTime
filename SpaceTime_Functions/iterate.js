/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */
'use strict';
var M = require('./map');

M.sequence = [];

M.I = {};


M.SEQ = function(src, i)
{
	return M.sequence[src + i];
};

var iterate = function(src, atr)
{
	//var Seq = M.$content(SEQ);

	M.$L('=======ITERATE================');
	M.$L(M.SEQ);

	//atr = [M.I];
	/*
		if (M.I <= 1)
		{
			return 1;
		}
		else
		{
			return M.SEQ(M.I, -2) + M.SEQ(M.I, -1);
		}
	}*/


	/*	atr = [
				M.I,
				[M.ifF, [[M.I, [M.bool, [M.LESSEQUAL, [5]]]], [1]]]
			];*/
	return [
	{
		iterate: atr
	}];
};


module.exports = iterate;