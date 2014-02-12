/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';
var M = require('./map');

var seq = {};

M.I = 0;


M.N = function(i)
{
	return seq[M.I + i];
};

var SEQ = function(src, likeFibf)
{
	//var Seq = M.$content(SEQ);

	M.$L('=======ITERATE================');
	M.$L(M.SEQ);

	var F = function()
	{
		if (M.I <= 1)
		{
			return 1;
		}
		else
		{
			return M.N(-2) + M.N(-1);
		}
	};


	return [F];
};


module.exports = SEQ;